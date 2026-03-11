'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

const ClockDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="text-right">
      <div className="text-sm text-gray-400">{formatDate(currentDate)}</div>
      <div className="text-lg font-mono font-medium text-white">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="glass-card border-b border-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="gradient-border p-0.5 rounded-lg">
            <div className="gradient-border-inner p-2">
              <Timer className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            DevChrono
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {isMounted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ClockDisplay />
            </motion.div>
          ) : (
            <div className="text-right">
              <div className="text-sm text-gray-400">Loading...</div>
              <div className="text-lg font-mono font-medium text-white">
                --:--:--
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
