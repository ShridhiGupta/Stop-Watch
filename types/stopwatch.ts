export interface Session {
  id: string;
  number: number;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in milliseconds
}

export interface StopwatchState {
  isRunning: boolean;
  startTime: Date | null;
  elapsedTime: number;
  sessions: Session[];
  currentSessionName: string;
}
