import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Job } from '../services/jobs.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000', // Update this to match your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class JobsGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  // Notify clients about job updates
  async notifyJobUpdate(updatedJob: Job): Promise<void> {
    this.server.emit('jobUpdate', updatedJob);
  }
}
