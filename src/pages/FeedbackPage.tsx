import React from 'react';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { FeedbackFormData } from '@/types/feedback';
import { submitFeedback } from '@/services/feedbackService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';
const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: FeedbackFormData) => {
    setLoading(true);
    try {
      const result = await submitFeedback(data, user?.id);
      
      if (result.success) {
        toast.success('Thank you for your feedback! We appreciate your input.');
        // Reset form by reloading (or implement form reset)
        window.location.reload();
      } else {
        toast.error(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-command-blue-600 dark:text-command-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Send Feedback
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Help us improve CyberSoluce™ by sharing your thoughts, reporting issues, or suggesting new features.
          </p>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <FeedbackForm onSubmit={handleSubmit} loading={loading} />
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            What happens to your feedback?
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• Your feedback is reviewed by our product team</li>
            <li>• Feature requests help us prioritize v2 development</li>
            <li>• Bug reports are tracked and addressed promptly</li>
            <li>• We may reach out for clarification if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

