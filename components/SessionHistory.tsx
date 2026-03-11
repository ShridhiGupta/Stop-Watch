'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Session } from '@/types/stopwatch';
import { formatTimeWithDate, formatDuration } from '@/utils/formatTime';
import { Clock, Calendar, Timer as TimerIcon, Edit2, Check, X } from 'lucide-react';

// Dynamically import motion to avoid SSR issues
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
});

interface SessionHistoryProps {
  sessions: Session[];
  updateSessionName: (sessionId: string, newName: string) => void;
}

export const SessionHistory = ({ sessions, updateSessionName }: SessionHistoryProps) => {
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

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
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
        <TimerIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No session history yet</p>
        <p className="text-sm text-gray-500 mt-2">Start timing to see your sessions here</p>
      </div>
    );
  }

  const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Session History</h3>
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </div>
          <div className="text-purple-400 font-medium">
            Total: {formatDuration(totalDuration)}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 max-h-96">
        {sessions.slice().reverse().map((session) => (
          <div key={session.id} className="gradient-border">
            <div className="gradient-border-inner p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="gradient-border p-0.5 rounded">
                    <div className="gradient-border-inner p-1">
                      <Clock className="w-3 h-3 text-indigo-400" />
                    </div>
                  </div>
                  {editingSessionId === session.id ? (
                    <div className="flex items-center space-x-2">
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-indigo-400">
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
                </div>
                <span className="text-xs text-purple-400 font-medium">
                  {formatDuration(session.duration)}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Start: {formatTimeWithDate(session.startTime)}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>End: {formatTimeWithDate(session.endTime!)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
