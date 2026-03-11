import { useState, useEffect, useRef } from 'react';
import { Session } from '@/types/stopwatch';

export const useStopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionName, setCurrentSessionName] = useState('Session');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  const start = () => {
    if (!isRunning) {
      setStartTime(new Date(Date.now() - elapsedTime));
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (isRunning) {
      setIsRunning(false);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
  };

  const newSession = () => {
    if (elapsedTime > 0) {
      const sessionStart = startTime || new Date(Date.now() - elapsedTime);
      const newSession: Session = {
        id: Date.now().toString(),
        number: sessions.length + 1,
        name: currentSessionName || `Session ${sessions.length + 1}`,
        startTime: sessionStart,
        endTime: new Date(),
        duration: elapsedTime,
      };
      
      setSessions([...sessions, newSession]);
      reset();
      setCurrentSessionName(`Session ${sessions.length + 2}`);
    }
  };

  const updateSessionName = (sessionId: string, newName: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId ? { ...session, name: newName } : session
    ));
  };

  return {
    isRunning,
    startTime,
    elapsedTime,
    sessions,
    currentSessionName,
    setCurrentSessionName,
    start,
    pause,
    reset,
    newSession,
    updateSessionName,
  };
};
