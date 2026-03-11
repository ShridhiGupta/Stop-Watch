'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Session } from '@/types/stopwatch';
import { formatTimeWithDate, formatDuration } from '@/utils/formatTime';
import { Edit2, Check, X } from 'lucide-react';

// Dynamically import motion to avoid SSR issues
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
});

interface SessionTimelineProps {
  sessions: Session[];
  updateSessionName: (sessionId: string, newName: string) => void;
}

export const SessionTimeline = ({ sessions, updateSessionName }: SessionTimelineProps) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const chipVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleEdit = (session: Session) => {
    setEditingSessionId(session.id);
    setTempName(session.name);
  };

  const handleSave = (sessionId: string) => {
    if (tempName.trim()) {
      updateSessionName(sessionId, tempName.trim());
      setEditingSessionId(null);
      setTempName('');
    }
  };

  const handleCancel = () => {
    setEditingSessionId(null);
    setTempName('');
  };

  if (sessions.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-400">No sessions recorded yet</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Session Timeline</h3>
      <div className="flex flex-wrap gap-3">
        {sessions.map((session) => (
          <div key={session.id} className="gradient-border">
            <div className="gradient-border-inner px-4 py-2 min-w-0">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  {editingSessionId === session.id ? (
                    <div className="flex items-center space-x-2 mb-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(session.id);
                          if (e.key === 'Escape') handleCancel();
                        }}
                        className="bg-card/50 border border-border/50 rounded px-2 py-1 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSave(session.id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-medium text-indigo-400">
                        {session.name}
                      </span>
                      <button
                        onClick={() => handleEdit(session)}
                        className="text-gray-400 hover:text-indigo-400"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="text-sm text-gray-300">
                    {formatTimeWithDate(session.startTime)} → {formatTimeWithDate(session.endTime!)}
                  </div>
                  <div className="text-xs text-purple-400 font-medium">
                    {formatDuration(session.duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
