export type ServiceType = 'video_editing' | 'idea_submission' | 'poster_photo_editing';
export type Currency = 'INR' | 'USD';

export type UserRole = 'owner' | 'admin' | 'team';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills?: string[];
  createdAt: string;
}

export interface ProjectAssignee {
  id: string;
  projectId: string;
  memberId: string;
  assignedAt: string;
}

export type ProjectStatus = 'Pending' | 'In Progress' | 'Review' | 'Completed';
export type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';

export interface ProjectTask {
  id: string;
  label: string;
  isDone: boolean;
  order: number;
}

export interface Project {
  id: string;
  clientName: string;
  clientContact: string; // Email or Instagram
  service: ServiceType;
  title: string;
  description: string;
  startDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  deliveredDate?: string | null; // Set automatically on Completed
  price: number; // in INR (Owner only, never sent to public)
  paymentStatus: PaymentStatus; // Owner only
  status: ProjectStatus;
  progressPercent: number; // 0 - 100
  notes?: string;
  attachments?: string[];
  tasks: ProjectTask[];
  assigneeIds: string[]; // Team member IDs assigned to project
  reviewToken?: string; // Private review submission token
  createdAt: string;
  updatedAt: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Converted' | 'Closed';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: ServiceType;
  deadline?: string;
  details: string;
  referenceLink?: string;
  status: InquiryStatus;
  createdAt: string;
}

export type IdeaStatus = 'New' | 'Reviewing' | 'Accepted' | 'Earning' | 'Paid' | 'Rejected';

export interface IdeaSubmission {
  id: string;
  name: string;
  contact: string; // Email or Instagram handle
  title: string;
  description: string;
  category: string;
  fileUrl?: string;
  consent: boolean;
  status: IdeaStatus;
  sharePercent: number; // Owner only, e.g. 20 for 20%
  amountEarned: number; // Owner only
  amountOwed: number; // Owner only
  amountPaid: number; // Owner only
  payoutNotes?: string; // Owner only
  createdAt: string;
}

export interface Review {
  id: string;
  projectId: string;
  projectTitle: string;
  clientName: string;
  rating: number; // 1 to 5
  comment: string;
  service?: string; // Service type: e.g. Cinematic Video Editing
  isApproved: boolean; // Must be approved by Harsha to appear publicly
  createdAt: string;
}

export interface LiveDeliveryStats {
  projectsDelivered: number;
  onTimeDeliveryPercent: number | null; // null if no completed projects
  averageTurnaroundDays: number | null; // null if no completed projects
  averageRating: number | null; // null if no approved reviews
  totalApprovedReviews: number;
}

export type PortfolioCategory = 'all' | 'videos' | 'posters' | 'photo_edits';

export interface PortfolioItem {
  id: string;
  type: 'video' | 'poster' | 'before_after';
  title: string;
  category: PortfolioCategory;
  tagline: string;
  mediaUrl: string; // YouTube embed ID/URL or image URL
  thumbnailUrl: string;
  beforeUrl?: string; // For before/after slider
  afterUrl?: string; // For before/after slider
  order: number;
  isVisible: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface StudioSettings {
  contactEmail: string; // unknowneditor910@gmail.com
  instagramHandle: string; // ur_harsha0
  heroHeadline: string;
  heroTagline: string;
  autoReplyTemplate: string;
  enableTwoFactor: boolean;
  backupLastRun?: string;
}

export interface StudioNotification {
  id: string;
  title: string;
  message: string;
  type: 'inquiry' | 'idea' | 'project' | 'review' | 'system';
  timestamp: string;
  read: boolean;
  emailPreview?: {
    to: string;
    subject: string;
    body: string;
  };
}

export interface PushNotificationPayload {
  id: string;
  title: string;
  body: string;
  category: 'new_inquiry' | 'new_idea' | 'project_assigned' | 'deadline_tomorrow' | 'project_completed';
  timestamp: string;
}
