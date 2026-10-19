import type { Project, Review, LiveDeliveryStats, UserRole, UserAccount } from '../types/index.ts';

/**
 * Calculate live delivery stats from real completed projects and approved reviews.
 * Returns null for any metric that has zero real data so it is hidden on public surfaces.
 */
export function calculateLiveDeliveryStats(
  projects: Project[],
  reviews: Review[]
): LiveDeliveryStats {
  const completedProjects = projects.filter((p) => p.status === 'Completed');

  // 1. Projects Delivered
  const projectsDelivered = completedProjects.length;

  // 2. On-Time Delivery %
  let onTimeDeliveryPercent: number | null = null;
  if (completedProjects.length > 0) {
    const onTimeCount = completedProjects.filter((p) => {
      if (!p.deliveredDate || !p.deadline) return false;
      return p.deliveredDate <= p.deadline;
    }).length;
    onTimeDeliveryPercent = Math.round((onTimeCount / completedProjects.length) * 100);
  }

  // 3. Average Turnaround in Days
  let averageTurnaroundDays: number | null = null;
  if (completedProjects.length > 0) {
    const validTurnarounds = completedProjects
      .filter((p) => p.startDate && p.deliveredDate)
      .map((p) => {
        const start = new Date(p.startDate).getTime();
        const delivered = new Date(p.deliveredDate!).getTime();
        const diffDays = Math.max(1, Math.round((delivered - start) / (1000 * 60 * 60 * 24)));
        return diffDays;
      });

    if (validTurnarounds.length > 0) {
      const sum = validTurnarounds.reduce((acc, curr) => acc + curr, 0);
      averageTurnaroundDays = Math.round((sum / validTurnarounds.length) * 10) / 10;
    }
  }

  // 4. Average Rating from approved reviews
  const approvedReviews = reviews.filter((r) => r.isApproved);
  let averageRating: number | null = null;
  if (approvedReviews.length > 0) {
    const totalRating = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    averageRating = Math.round((totalRating / approvedReviews.length) * 10) / 10;
  }

  return {
    projectsDelivered,
    onTimeDeliveryPercent,
    averageTurnaroundDays,
    averageRating,
    totalApprovedReviews: approvedReviews.length,
  };
}

/**
 * Role-Based Access Control (RBAC) helpers
 */
export function canViewPayouts(role: UserRole): boolean {
  return role === 'owner';
}

export function canManageTeam(role: UserRole): boolean {
  return role === 'owner';
}

export function canEditContent(role: UserRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function filterProjectsByRole(projects: Project[], user: UserAccount): Project[] {
  if (user.role === 'team') {
    return projects.filter((p) => p.assigneeIds && p.assigneeIds.includes(user.id));
  }
  return projects;
}

/**
 * Obfuscate email for anti-bot protection on public DOM
 */
export function obfuscateEmailDisplay(email: string): { userPart: string; domainPart: string; full: string } {
  const parts = email.split('@');
  if (parts.length !== 2) return { userPart: email, domainPart: '', full: email };
  return {
    userPart: parts[0],
    domainPart: parts[1],
    full: email,
  };
}

/**
 * Check deadline urgency for push notifications (e.g. deadline tomorrow)
 */
export function isDeadlineTomorrow(deadline: string): boolean {
  if (!deadline) return false;
  const target = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}
