import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'default' | 'danger' | 'warning';
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'default',
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  const getConfirmButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {getIcon() && (
            <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
              type === 'danger' 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-yellow-100 dark:bg-yellow-900/30'
            }`}>
              {getIcon()}
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-center gap-3 sm:justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
export { ConfirmDialog };

