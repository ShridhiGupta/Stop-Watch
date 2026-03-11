'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNewSession: () => void;
  isRunning: boolean;
}

export const useKeyboardShortcuts = ({
  onStart,
  onPause,
  onReset,
  onNewSession,
  isRunning,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts from triggering when user is typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key.toLowerCase()) {
        case ' ':
        case 'spacebar':
          event.preventDefault();
          if (isRunning) {
            onPause();
          } else {
            onStart();
          }
          break;
        case 'r':
          event.preventDefault();
          onReset();
          break;
        case 'n':
          event.preventDefault();
          onNewSession();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart, onPause, onReset, onNewSession, isRunning]);
};
