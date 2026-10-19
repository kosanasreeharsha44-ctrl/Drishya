import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLiveDeliveryStats,
  canViewPayouts,
  canManageTeam,
  canEditContent,
  filterProjectsByRole,
  isDeadlineTomorrow,
} from './deliveryStats.ts';
import type { Project, Review, UserAccount } from '../types/index.ts';

test('calculateLiveDeliveryStats returns nulls when zero completed projects and zero reviews', () => {
  const stats = calculateLiveDeliveryStats([], []);
  assert.equal(stats.projectsDelivered, 0);
  assert.equal(stats.onTimeDeliveryPercent, null);
  assert.equal(stats.averageTurnaroundDays, null);
  assert.equal(stats.averageRating, null);
  assert.equal(stats.totalApprovedReviews, 0);
});

test('calculateLiveDeliveryStats computes real on-time % and turnaround when projects are completed', () => {
  const sampleProjects: Project[] = [
    {
      id: 'p1',
      title: 'Commercial 1',
      clientName: 'Client A',
      clientContact: 'a@test.com',
      service: 'video_editing',
      description: '',
      startDate: '2026-10-01',
      deadline: '2026-10-05',
      deliveredDate: '2026-10-04', // On-time (4 days turnaround)
      price: 20000,
      paymentStatus: 'Paid',
      status: 'Completed',
      progressPercent: 100,
      tasks: [],
      assigneeIds: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'p2',
      title: 'Commercial 2',
      clientName: 'Client B',
      clientContact: 'b@test.com',
      service: 'video_editing',
      description: '',
      startDate: '2026-10-02',
      deadline: '2026-10-06',
      deliveredDate: '2026-10-07', // Late (5 days turnaround)
      price: 25000,
      paymentStatus: 'Paid',
      status: 'Completed',
      progressPercent: 100,
      tasks: [],
      assigneeIds: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'p3',
      title: 'Ongoing edit',
      clientName: 'Client C',
      clientContact: 'c@test.com',
      service: 'poster_photo_editing',
      description: '',
      startDate: '2026-10-10',
      deadline: '2026-10-20',
      deliveredDate: null,
      price: 15000,
      paymentStatus: 'Unpaid',
      status: 'In Progress',
      progressPercent: 50,
      tasks: [],
      assigneeIds: [],
      createdAt: '',
      updatedAt: '',
    },
  ];

  const sampleReviews: Review[] = [
    {
      id: 'r1',
      projectId: 'p1',
      projectTitle: 'Commercial 1',
      clientName: 'Client A',
      rating: 5,
      comment: 'Top quality color grade.',
      isApproved: true,
      createdAt: '',
    },
    {
      id: 'r2',
      projectId: 'p2',
      projectTitle: 'Commercial 2',
      clientName: 'Client B',
      rating: 4,
      comment: 'Solid work.',
      isApproved: true,
      createdAt: '',
    },
    {
      id: 'r3',
      projectId: 'p2',
      projectTitle: 'Commercial 2',
      clientName: 'Spam Bot',
      rating: 1,
      comment: 'Spam',
      isApproved: false, // Unapproved should not affect public average
      createdAt: '',
    },
  ];

  const stats = calculateLiveDeliveryStats(sampleProjects, sampleReviews);
  assert.equal(stats.projectsDelivered, 2);
  assert.equal(stats.onTimeDeliveryPercent, 50); // 1 out of 2 completed on time
  assert.equal(stats.averageTurnaroundDays, 4); // (3 + 5) / 2
  assert.equal(stats.averageRating, 4.5); // (5 + 4) / 2
  assert.equal(stats.totalApprovedReviews, 2);
});

test('RBAC role enforcement restricts payouts and team management', () => {
  assert.equal(canViewPayouts('owner'), true);
  assert.equal(canViewPayouts('admin'), false);
  assert.equal(canViewPayouts('team'), false);

  assert.equal(canManageTeam('owner'), true);
  assert.equal(canManageTeam('admin'), false);
  assert.equal(canManageTeam('team'), false);

  assert.equal(canEditContent('owner'), true);
  assert.equal(canEditContent('admin'), true);
  assert.equal(canEditContent('team'), false);
});

test('filterProjectsByRole restricts team members to only assigned projects', () => {
  const teamUser: UserAccount = {
    id: 'u-team-1',
    name: 'Ankit Editor',
    email: 'ankit@drishya.studio',
    role: 'team',
  };

  const projects: Project[] = [
    {
      id: 'p1',
      title: 'Assigned Project',
      clientName: '',
      clientContact: '',
      service: 'video_editing',
      description: '',
      startDate: '2026-10-01',
      deadline: '2026-10-10',
      price: 0,
      paymentStatus: 'Unpaid',
      status: 'In Progress',
      progressPercent: 0,
      tasks: [],
      assigneeIds: ['u-team-1'],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'p2',
      title: 'Unassigned Project',
      clientName: '',
      clientContact: '',
      service: 'video_editing',
      description: '',
      startDate: '2026-10-01',
      deadline: '2026-10-10',
      price: 0,
      paymentStatus: 'Unpaid',
      status: 'In Progress',
      progressPercent: 0,
      tasks: [],
      assigneeIds: ['u-other'],
      createdAt: '',
      updatedAt: '',
    },
  ];

  const filtered = filterProjectsByRole(projects, teamUser);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'p1');
});
