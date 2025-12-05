import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FeedbackForm } from './FeedbackForm';
import { FeedbackFormData } from '@/types/feedback';
import { submitFeedback } from '@/services/feedbackService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import { logger } from '@/utils/logger';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialCategory?: FeedbackFormData['category'];
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onOpenChange,
  initialCategory,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (data: FeedbackFormData) => {
    setLoading(true);
    try {
      const result = await submitFeedback(data, user?.id);
      
      if (result.success) {
        setSubmitted(true);
        toast.success('Thank you for your feedback! We appreciate your input.');
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setSubmitted(false);
          onOpenChange(false);
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      logger.error('Error submitting feedback', error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSubmitted(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl mb-2">Thank You!</DialogTitle>
            <DialogDescription className="text-base">
              Your feedback has been submitted successfully. We'll review it and
              use it to improve CyberSoluce™.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-command-blue-600 dark:text-command-blue-400" />
                <DialogTitle>Send Feedback</DialogTitle>
              </div>
              <DialogDescription>
                Help us improve CyberSoluce™ by sharing your thoughts, reporting
                issues, or suggesting new features.
              </DialogDescription>
            </DialogHeader>
            <FeedbackForm
              onSubmit={handleSubmit}
              onCancel={handleClose}
              initialData={initialCategory ? { category: initialCategory } : undefined}
              loading={loading}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

