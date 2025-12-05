export type FeedbackCategory = 
  | 'feature-request'
  | 'bug-report'
  | 'general-feedback'
  | 'ui-ux-improvement'
  | 'performance-issue'
  | 'documentation-request';

export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export type FeedbackStatus = 'new' | 'reviewed' | 'in-progress' | 'resolved';

export interface FeedbackContext {
  page: string;
  route: string;
  userAgent?: string;
  timestamp: string;
}

export interface FeedbackSubmission {
  id?: string;
  userId?: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  title: string;
  description: string;
  context?: FeedbackContext;
  status?: FeedbackStatus;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeedbackFormData {
  category: FeedbackCategory;
  priority: FeedbackPriority;
  title: string;
  description: string;
}

