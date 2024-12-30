import io from 'socket.io-client';
import { Job } from '../types/job';

const socket = io('http://localhost:5000');

export const connectSocket = (onJobUpdate: (job: Job) => void): (() => void) => {
  socket.on('jobUpdate', onJobUpdate);

  return () => {
    socket.off('jobUpdate', onJobUpdate);
  };
};

export const disconnectSocket = (): void => {
  socket.disconnect();
};
