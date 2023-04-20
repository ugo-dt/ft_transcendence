import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client, { IClient, STATUS_OFFLINE, _Status } from './Client/Client';
import Queue from './Matchmaking/Queue';
import Room, { IRoom } from './Room/Room';
import RoomHistory from './Room/RoomHistory';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PongService {

  constructor(private readonly usersService: UsersService) { }

  public async handleUserConnected(clientSocket: Socket): Promise<void> {
    let client = Client.at(clientSocket.handshake.query.username as string);
    if (!client) {
      client = Client.new(clientSocket);
      Logger.log(`Client created: ${client.username} (id: ${client.id})`);
      return ;
    }
    this.updateClient(clientSocket);
    Logger.log(`Client connected: ${client.username} (id: ${client.id})`);
  }

  public async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    client.status = STATUS_OFFLINE;
    Logger.log(`Client disconnected: ${client.username} (id: ${client.id})`);
    // Client.delete(clientSocket);
  }

  public updateClient(clientSocket: Socket) {
    const client = Client.at(clientSocket.handshake.query.username as string);
    if (!client) {
      return 'user not found';
    }
    client.__socket = clientSocket;
    client.id = parseInt(clientSocket.handshake.query.id as string);
    client.id42 = parseInt(clientSocket.handshake.query.id42 as string);
    client.username = clientSocket.handshake.query.username as string;
    client.avatar = clientSocket.handshake.query.avatar as string;
    client.status = clientSocket.handshake.query.status as _Status;
    client.rating = parseInt(clientSocket.handshake.query.rating as string);
    client.backgroundColor = clientSocket.handshake.query.backgroundColor as string;
  }

  public addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    if (Queue.has(client)) {
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

  public profile(id: string): IClient | null {
    const client = Client.at(id);
    if (client) {
      return client.IClient();
    }
    return null;
  }

  public users(): IClient[] {
    return Client.list();
  }

  public userFriendList(username: string): IClient[] | null {
    const client = Client.at(username);
    if (client) {
      return client.friends;
    }
    return null;
  }

  public rankings(): IClient[] {
    const users = Client.list().slice(0, 50);
    return users.sort((a, b) => (a.rating > b.rating) ? -1 : 1);
  }

  public rooms(): IRoom[] {
    return Room.list();
  }

  public userHistory(username: string): IRoom[] {
    const client = Client.at(username);
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
