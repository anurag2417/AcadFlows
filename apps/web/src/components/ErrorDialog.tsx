import React from 'react';

interface ErrorDialogProps {
  message: string;
  onClose: () => void;
  title?: string;
}

export default function ErrorDialog({
  message,
  onClose,
  title = 'Something went wrong',
}: ErrorDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-dialog-title"
        onClick={event => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            !
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="error-dialog-title" className="text-lg font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
