import React from 'react';
import { WifiOff, Wifi, Clock, FolderSync as Sync } from 'lucide-react';
import { useOfflineStatus } from '../../utils/offline';

export const OfflineIndicator: React.FC = () => {
  const { isOffline, pendingOperations } = useOfflineStatus();

  if (!isOffline && pendingOperations === 0) {
    return null; // Don't show anything when online with no pending operations
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-sm ${
      isOffline ? 'animate-pulse' : ''
    }`}>
      <div className={`rounded-lg shadow-lg border-2 p-4 ${
        isOffline 
          ? 'bg-red-50 border-red-200 text-red-800' 
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${
            isOffline ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {isOffline ? (
              <WifiOff className="h-5 w-5" />
            ) : pendingOperations > 0 ? (
              <Sync className="h-5 w-5 animate-spin" />
            ) : (
              <Wifi className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="font-medium">
              {isOffline ? 'You\'re offline' : 'Syncing changes'}
            </div>
            <div className="text-sm opacity-90">
              {isOffline 
                ? 'Changes will sync when connection is restored'
                : `${pendingOperations} changes pending sync`
              }
            </div>
          </div>
          
          {pendingOperations > 0 && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isOffline ? 'bg-red-200 text-red-900' : 'bg-yellow-200 text-yellow-900'
            }`}>
              {pendingOperations}
            </div>
          )}
        </div>
        
        {pendingOperations > 0 && (
          <div className="mt-3 flex items-center text-xs opacity-75">
            <Clock className="h-3 w-3 mr-1" />
            <span>Your changes are saved locally and will sync automatically</span>
          </div>
        )}
      </div>
    </div>
  );
};