import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client, { STATUS_OFFLINE } from './Client/Client';
import Queue from './Matchmaking/Queue';
import Room, { IRoom } from './Room/Room';
import RoomHistory from './Room/RoomHistory';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PongService {
  constructor(private readonly usersService: UsersService) { }

  public async handleUserConnected(clientSocket: Socket): Promise<void> {
    const id: number = parseInt(clientSocket.handshake.query.id as string);
    const user = await this.usersService.findOneId(id);
    if (!user) {
      return ;
    }
    let client = Client.at(id);
    if (!client) {
      client = Client.new(user, clientSocket);
    }
    else {
      client.user = user;
      client.socket = clientSocket;
    }
    Logger.log(`Client connected: ${user.username} (id: ${user.id})`);
  }

  public async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    this.removeClientFromQueue(clientSocket);
    this.usersService.update(client.user.id, {status: STATUS_OFFLINE});
    Logger.log(`Client disconnected: ${client.user.username} (id: ${client.user.id})`);
    Client.delete(clientSocket);
  }

  public addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    console.log(client);
    
    if (!client || Queue.has(client)) {
      return ;
    }
    Queue.add(client);
    Logger.log(`Added client ${client.user.id} to queue.`);
  }

  public removeClientFromQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || !Queue.has(client)) {
      return ;
    }
    Queue.remove(client);
    Logger.log(`Removed client ${client.user.id} from queue.`);
  }

  public startGame(server: Server, left: Client, right: Client) {
    Queue.remove(left);
    Queue.remove(right);
    const room = Room.new(left, right);
    room.startGame(server, this.usersService);
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

  public rooms(): IRoom[] {
    return Room.list();
  }

  public userHistory(id: number): IRoom[] {
    const client = Client.at(id);
    console.log(client);

    if (client) {
      return RoomHistory.userHistory(client);
    }
    return [];
  }

  public history(): IRoom[] {
    return RoomHistory.list();
  }

  public startChallenge() {
  }
}
