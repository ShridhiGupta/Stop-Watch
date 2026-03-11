import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, Pause, RotateCcw, Plus, Edit2 } from 'lucide-react';
import { formatTime } from '@/utils/formatTime';

// Dynamically import motion to avoid SSR issues
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
});

const MotionButton = dynamic(() => import('framer-motion').then((mod) => mod.motion.button), {
  ssr: false,
});

interface StopwatchProps {
  isRunning: boolean;
  elapsedTime: number;
  currentSessionName: string;
  setCurrentSessionName: (name: string) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onNewSession: () => void;
}

export const Stopwatch = ({
  isRunning,
  elapsedTime,
  currentSessionName,
  setCurrentSessionName,
  onStart,
  onPause,
  onReset,
  onNewSession,
}: StopwatchProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentSessionName);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTempName(currentSessionName);
  }, [currentSessionName]);

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setCurrentSessionName(tempName.trim());
      setIsEditingName(false);
    }
  };

  return (
    <div className="gradient-border">
      <div className="gradient-border-inner">
        <div className="flex flex-col items-center space-y-8">
          <div className={`text-center ${isRunning ? 'animate-pulse-glow' : ''}`}>
            <div className="text-8xl font-mono font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
              {formatTime(elapsedTime)}
            </div>
          </div>

          {/* Session Name Input */}
          <div className="w-full max-w-md">
            {isEditingName ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSubmit();
                    if (e.key === 'Escape') {
                      setTempName(currentSessionName);
                      setIsEditingName(false);
                    }
                  }}
                  onBlur={handleNameSubmit}
                  className="flex-1 bg-card/50 border border-border/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500/50 transition-colors"
                  placeholder="Enter session name..."
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-400">Current:</span>
                <span className="text-white font-medium">{currentSessionName}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isMounted ? (
              <MotionButton
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={isRunning ? onPause : onStart}
                className={`glow-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium ${
                  isRunning ? 'from-orange-500 to-red-500' : 'from-indigo-500 to-purple-500'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start</span>
                  </>
                )}
              </MotionButton>
            ) : (
              <button
                onClick={isRunning ? onPause : onStart}
                className={`glow-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium ${
                  isRunning ? 'from-orange-500 to-red-500' : 'from-indigo-500 to-purple-500'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start</span>
                  </>
                )}
              </button>
            )}

            {isMounted ? (
              <MotionButton
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={onReset}
                className="glow-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium from-gray-600 to-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </MotionButton>
            ) : (
              <button
                onClick={onReset}
                className="glow-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium from-gray-600 to-gray-700"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            )}

            {isMounted ? (
              <MotionButton
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={onNewSession}
                disabled={elapsedTime === 0}
                className={`glow-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium ${
                  elapsedTime === 0
                    ? 'from-gray-700 to-gray-800 opacity-50 cursor-not-allowed'
                    : 'from-green-500 to-emerald-500'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>New Session</span>
              </MotionButton>
            ) : (
              <button
                onClick={onNewSession}
                disabled={elapsedTime === 0}
                className={`glow-button px-6 py-3 rounded-lg flex items-center space-x-2 text-white font-medium ${
                  elapsedTime === 0
                    ? 'from-gray-700 to-gray-800 opacity-50 cursor-not-allowed'
                    : 'from-green-500 to-emerald-500'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span>New Session</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
