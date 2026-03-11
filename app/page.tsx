'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Stopwatch } from '@/components/Stopwatch';
import { SessionTimeline } from '@/components/SessionTimeline';
import { SessionHistory } from '@/components/SessionHistory';
import { useStopwatch } from '@/hooks/useStopwatch';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

// Dynamically import motion to avoid SSR issues
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
});

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    isRunning,
    elapsedTime,
    sessions,
    currentSessionName,
    setCurrentSessionName,
    start,
    pause,
    reset,
    newSession,
    updateSessionName,
  } = useStopwatch();

  useKeyboardShortcuts({
    onStart: start,
    onPause: pause,
    onReset: reset,
    onNewSession: newSession,
    isRunning,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1f1f2b 1px, transparent 1px),
            linear-gradient(to bottom, #1f1f2b 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-10 animate-float" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Main stopwatch */}
            <div className="lg:col-span-2 space-y-8">
              {isMounted ? (
                <MotionDiv
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Stopwatch
                    isRunning={isRunning}
                    elapsedTime={elapsedTime}
                    currentSessionName={currentSessionName}
                    setCurrentSessionName={setCurrentSessionName}
                    onStart={start}
                    onPause={pause}
                    onReset={reset}
                    onNewSession={newSession}
                  />
                  
                  <SessionTimeline 
                    sessions={sessions} 
                    updateSessionName={updateSessionName}
                  />
                </MotionDiv>
              ) : (
                <div>
                  <Stopwatch
                    isRunning={isRunning}
                    elapsedTime={elapsedTime}
                    currentSessionName={currentSessionName}
                    setCurrentSessionName={setCurrentSessionName}
                    onStart={start}
                    onPause={pause}
                    onReset={reset}
                    onNewSession={newSession}
                  />
                  
                  <SessionTimeline 
                    sessions={sessions} 
                    updateSessionName={updateSessionName}
                  />
                </div>
              )}
            </div>

            {/* Right - Session history */}
            <div className="lg:col-span-1">
              {isMounted ? (
                <MotionDiv
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <SessionHistory 
                    sessions={sessions} 
                    updateSessionName={updateSessionName}
                  />
                </MotionDiv>
              ) : (
                <SessionHistory 
                  sessions={sessions} 
                  updateSessionName={updateSessionName}
                />
              )}
            </div>
          </div>
        </main>

        {/* Keyboard shortcuts hint */}
        {isMounted && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-4 left-4 text-xs text-gray-500 space-y-1"
          >
            <div>Space: Start/Pause</div>
            <div>R: Reset</div>
            <div>N: New Session</div>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}
