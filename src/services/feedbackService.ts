import { supabase, isSupabaseEnabled, handleSupabaseError } from '../lib/supabase';
import { FeedbackSubmission, FeedbackFormData, FeedbackContext } from '../types/feedback';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';

/**
 * Get current page context for feedback
 */
export function getFeedbackContext(): FeedbackContext {
  return {
    page: window.location.pathname,
    route: window.location.pathname + window.location.search,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Submit feedback to Supabase
 */
export async function submitFeedback(
  formData: FeedbackFormData,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const context = getFeedbackContext();
    
    const feedback: Omit<FeedbackSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: userId || undefined,
      category: formData.category,
      priority: formData.priority,
      title: formData.title.trim(),
      description: formData.description.trim(),
      context,
      status: 'new',
      submittedAt: new Date().toISOString(),
    };

    // If Supabase is not enabled, fall back to localStorage
    if (!isSupabaseEnabled || !supabase) {
      logger.info('Feedback submission (demo mode):', feedback);
      // In demo mode, store in localStorage as a fallback
      try {
        const stored = localStorage.getItem('cybersoluce_feedback');
        const existingFeedback = stored ? JSON.parse(stored) : [];
        
        if (!Array.isArray(existingFeedback)) {
          throw new Error('Invalid stored feedback format');
        }
        
        existingFeedback.push({
          ...feedback,
          id: `demo_${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('cybersoluce_feedback', JSON.stringify(existingFeedback));
      } catch (error) {
        logger.warn('Failed to store feedback in localStorage, resetting storage', error);
        // Reset corrupted storage
        try {
          localStorage.removeItem('cybersoluce_feedback');
          // Try storing just this feedback
          localStorage.setItem('cybersoluce_feedback', JSON.stringify([{
            ...feedback,
            id: `demo_${Date.now()}`,
            createdAt: new Date().toISOString(),
          }]));
        } catch (storageError) {
          logger.error('Failed to reset localStorage for feedback', storageError);
          // Continue anyway - feedback is logged
        }
      }
      
      return { success: true };
    }

    // Submit to Supabase
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([feedback])
      .select()
      .single();

    if (error) {
      handleSupabaseError(error, 'Failed to submit feedback');
      return { success: false, error: error.message };
    }

    logger.info('Feedback submitted successfully:', data);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error submitting feedback:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Get user's feedback submissions (if authenticated)
 */
export async function getUserFeedback(
  userId: string
): Promise<FeedbackSubmission[]> {
    try {
      if (!isSupabaseEnabled || !supabase) {
        // In demo mode, return from localStorage
        try {
          const stored = localStorage.getItem('cybersoluce_feedback');
          if (!stored) return [];
          
          const allFeedback = JSON.parse(stored);
          if (!Array.isArray(allFeedback)) {
            logger.warn('Invalid feedback storage format, resetting');
            localStorage.removeItem('cybersoluce_feedback');
            return [];
          }
          
          return allFeedback.filter((f: FeedbackSubmission) => f.userId === userId);
        } catch (error) {
          logger.warn('Failed to parse stored feedback, resetting storage', error);
          localStorage.removeItem('cybersoluce_feedback');
          return [];
        }
      }

    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      handleSupabaseError(error, 'Failed to fetch feedback');
      return [];
    }

    return (data || []).map(mapRowToFeedback);
  } catch (error) {
    logger.error('Error fetching user feedback:', error);
    return [];
  }
}

/**
 * Map database row to FeedbackSubmission
 */
function mapRowToFeedback(row: any): FeedbackSubmission {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category,
    priority: row.priority,
    title: row.title,
    description: row.description,
    context: row.context,
    status: row.status || 'new',
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

