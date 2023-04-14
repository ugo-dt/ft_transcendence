import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client, { IClient } from './Client/Client';
import Queue from './Matchmaking/Queue';
import Room, { IRoom } from './Room/Room';
import RoomHistory from './Room/RoomHistory';

@Injectable()
export class PongService {

  public async handleUserConnected(clientSocket: Socket): Promise<void> {
    const client = Client.new(clientSocket);
    Logger.log(`Client connected: ${client.name} (id: ${client.id})`);
  }

  public async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    Logger.log(`Client disconnected: ${client.name} (id: ${client.id})`);    
    Client.delete(clientSocket);
  }

  public addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    Queue.add(client);
    Logger.log(`Added client ${client.id} to queue.`);
  }

  public removeClientFromQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    Queue.remove(client);
    Logger.log(`Removed client ${client.id} from queue.`);
  }

  public startGame(server: Server, left: Client, right: Client) {
    Queue.remove(left);
    Queue.remove(right);
    const room = Room.new(left, right);
    room.startGame(server);
  }

  public spectateRoom(clientSocket: Socket, roomId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const room = Room.at(roomId);
    if (room) {
      room.addSpectator(client);
    }
  }

  public stopSpectateRoom(clientSocket: Socket, roomId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const room = Room.at(roomId);
    if (room) {
      room.removeSpectator(client);
    }
  }

  public handleKey(clientSocket: Socket, direction: string, isPressed: boolean) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const room = Room.with(client);
    if (!room) {
      return ;
    }
    room.handleKey(client, direction, isPressed);
  }

  public users(): IClient[] {
    return Client.list();
  }

  public rooms(): IRoom[] {
    return Room.list();
  }

  public history(): IRoom[] {
    return RoomHistory.list();
  }
}
