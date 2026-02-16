"use client";
import { UnsavedChangesIndicatorProps } from '@/lib/types';
import { Button } from '../ui/button';

/**
 * UNSAVED CHANGES INDICATOR COMPONENT
 * 
 * Shows number of unsaved changes and download button
 * Displays alert banner when there are changes
 */

export const UnsavedChangesIndicator = ({
  changesCount,
  onDownload,
  isDownloading = false,
}: UnsavedChangesIndicatorProps) => {
  if (changesCount === 0) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between p-4 border rounded">
      <div className="flex items-center gap-2">
        <span className="text-sm">
          🔴 {changesCount} unsaved change{changesCount !== 1 ? 's' : ''}
        </span>
      </div>
      <Button onClick={onDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download Updated Vault'}
      </Button>
    </div>
  );
};