import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Player } from './game/Player';

@Injectable()
export class PongService {
  async handleUserConnected(wss: Server, client: Socket, players: Socket[]): Promise<void> {
  }

  async handleUserDisconnect(wss: Server, client: Socket): Promise<void> {
  }
}
