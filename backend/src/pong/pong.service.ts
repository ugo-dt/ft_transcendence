import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client, { STATUS_OFFLINE } from './Client/Client';
import Queue from './Matchmaking/Queue';
import GameRoom, { IGameRoom } from '../room/GameRoom';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RoomService } from 'src/room/room.service';
import { Room } from 'src/room/entities/room.entity';

@Injectable()
export class PongService {
  private readonly logger: Logger;
  constructor(private readonly usersService: UsersService, private readonly roomService: RoomService) {
    this.logger = new Logger("PongService");
    this.__init__();
  }

  private async __init__(){
    const users: User[] = await this.usersService.findAll();
    for (const user of users.values()) {
      let client = Client.at(user.id);
      if (!client) {
        client = Client.new(user, null);
      }
      else {
        client.user = user;
        client.socket = null;
      }
    }
    this.logger.log(`Initialized ${Client.list().length} clients`);    
  };

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
      if (!client.socket || !client.socket.connected) {
        client.socket = clientSocket;
      }
    }
    this.logger.log(`Client connected: ${user.username} (id: ${user.id})`);
  }

  public async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    this.removeClientFromQueue(clientSocket);
    this.usersService.update(client.user.id, {status: STATUS_OFFLINE});
    this.logger.log(`Client disconnected: ${client.user.username} (id: ${client.user.id})`);
  }

  public addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || Queue.has(client)) {
      return ;
    }
    Queue.add(client);
    this.logger.log(`Added client ${client.user.id} to queue.`);
  }

  public removeClientFromQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || !Queue.has(client)) {
      return ;
    }
    Queue.remove(client);
    this.logger.log(`Removed client ${client.user.id} from queue.`);
  }

  public async startGame(server: Server, left: Client, right: Client) {
    Queue.remove(left);
    Queue.remove(right);
    const room = await GameRoom.new(this.roomService, left, right);
    room.startGame(server, this.usersService, this.roomService);
  }

  public spectateRoom(clientSocket: Socket, roomId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const room = GameRoom.at(roomId);
    if (room) {
      room.addSpectator(client);
    }
  }

  public stopSpectateRoom(clientSocket: Socket, roomId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const room = GameRoom.at(roomId);
    if (room) {
      room.removeSpectator(client);
    }
  }

  public handleKey(clientSocket: Socket, direction: string, isPressed: boolean) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const room = GameRoom.with(client);
    if (!room) {
      return ;
    }
    room.handleKey(client, direction, isPressed);
  }

  public rooms(): IGameRoom[] {
    const list: IGameRoom[] = [];
    for (const room of GameRoom.list().values()) {
      list.push(room.IGameRoom());
    }
    return list;
  }

  public async userHistory(id: number): Promise<IGameRoom[]> {
    const user = await this.usersService.findOneId(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const rooms: Room[] = await this.roomService.findAllWithUser(user);
    const list: IGameRoom[] = [];
    for (const room of rooms.values()) {
      list.push(this.roomService.IGameRoom(room));
    }
    return list;
  }

  public gameResults(roomId: number) {
    return this.roomService.findOneId(roomId);
  }

  public async history() {
    return await this.roomService.findAll();
  }

  public startChallenge() {
  }
}
