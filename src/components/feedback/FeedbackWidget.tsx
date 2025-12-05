import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { FeedbackModal } from './FeedbackModal';
import { cn } from '@/utils/cn';

interface FeedbackWidgetProps {
  className?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center justify-center',
          'h-14 w-14 rounded-full shadow-lg',
          'bg-command-blue-600 hover:bg-command-blue-700',
          'dark:bg-command-blue-500 dark:hover:bg-command-blue-600',
          'text-white transition-all duration-200',
          'hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-command-blue-500 focus:ring-offset-2',
          'focus:ring-offset-white dark:focus:ring-offset-gray-900',
          className
        )}
        aria-label="Send feedback"
        title="Send feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      <FeedbackModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};

