import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client from './Client/Client';
import Queue from './Matchmaking/Queue';
import GameRoom, { GAMETYPE_CASUAL, GAMETYPE_RANKED, GameType, IGameRoom } from '../room/GameRoom';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RoomService } from 'src/room/room.service';
import { Room } from 'src/room/entities/room.entity';

@Injectable()
export class PongService {
  private readonly logger: Logger;
  constructor(private readonly usersService: UsersService, private readonly roomService: RoomService) {
    this.logger = new Logger("PongService");
  }

  public getUsersService(): UsersService {
    return this.usersService;
  }

  public async __init__() {    
    const users: User[] = await this.usersService.findAll();
    for (const user of users.values()) {
      let client = Client.at(user.id);
      if (!client) {
        client = Client.new(user.id, null);
      }
      else {
        client.id = user.id;
        client.sockets = [];
      }
    }
    this.logger.log(`Initialized ${Client.list().length} client${Client.list().length > 1 ? 's' : ''}`);
  };

  public async handleUserConnected(clientSocket: Socket): Promise<void> {
    const user = await this.usersService.findOneId(parseInt(clientSocket.handshake.query.id as string));
    if (!user) {
      return;
    }
    if (!(await this.usersService.isInGame(user.id))) {
      this.usersService.setOnline(user.id);
    }
    const client = Client.at(user.id);
    if (!client) {
      Client.new(user.id, clientSocket);
    }
    else {
      client.id = user.id;
      if (!(await this.usersService.isInGame(user.id))) {
        client.addSocket(clientSocket);
      }
    }
    this.logger.log(`Client connected: ${user.username} (id: ${user.id})`);
  }

  public async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    this.cancelChallenge(clientSocket);
    client.removeSocket(clientSocket);
    this.usersService.setOffline(client.id);
    this.removeClientFromQueue(clientSocket);
    this.logger.log(`S disconnected: ${client.id}`);
  }

  public addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || Queue.has(client)) {
      return;
    }
    Queue.add(client);
    this.logger.log(`Added client ${client.id} to queue.`);
  }

  public removeClientFromQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || !Queue.has(client)) {
      return;
    }
    Queue.remove(client);
    this.logger.log(`Removed client ${client.id} from queue.`);
  }

  public async startGame(server: Server, left: Client, right: Client, type: GameType) {
    Queue.remove(left);
    Queue.remove(right);
    const room = await GameRoom.new(this.roomService, left, right, type);
    room.startGame(server, this.usersService, this.roomService);
  }

  public spectateRoom(clientSocket: Socket, roomId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    const room = GameRoom.at(roomId);
    if (room) {
      room.addSpectator(client);
    }
  }

  public stopSpectateRoom(clientSocket: Socket, roomId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    const room = GameRoom.at(roomId);
    if (room) {
      room.removeSpectator(client);
    }
  }

  public handleKey(clientSocket: Socket, direction: string, isPressed: boolean) {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    const room = GameRoom.with(client);
    if (!room) {
      return;
    }
    const playerId = client.id === room.left.id ? room.left.id : room.right.id;
    room.handleKey(playerId, direction, isPressed);
  }

  public async rooms(): Promise<IGameRoom[]> {
    const list: IGameRoom[] = [];
    for (const room of GameRoom.list().values()) {
      const leftUser = await this.usersService.findOneId(room.left.id);
      const rightUser = await this.usersService.findOneId(room.right.id);
      if (leftUser && rightUser) {
        list.push(room.IGameRoom(leftUser, rightUser));
      }
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
      if (room.gameState && room.gameState.gameOver) {
        const leftUser = await this.usersService.findOneId(room.left);
        const rightUser = await this.usersService.findOneId(room.right);
        if (leftUser && rightUser) {
          list.push(this.roomService.IGameRoom(room, leftUser, rightUser));
        }
      }
    }
    return list;
  }

  public gameResults(roomId: number) {
    return this.roomService.findOneId(roomId);
  }

  public async history() {
    return await this.roomService.findAll();
  }

  public startChallenge(clientSocket: Socket, opponentId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return 'user not found';
    }
    const opponent = Client.at(opponentId);
    if (!opponent) {
      return 'opponent not found';
    }
    if (!this.usersService.isOnline(opponent.id)) {
      return 'opponent is unavailable';
    }
    client.createChallenge(clientSocket.id, opponent.id);
    opponent.addInvitation(client.id)
    this.logger.log(`New challenge: ${client.id} invited ${opponent.id}`);
    return 'sent';
  }

  public cancelChallenge(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client) {
      return ;
    }
    const opponentId = client.getChallengeOpponent(clientSocket.id);
    if (opponentId == undefined) {
      return ;
    }
    const opponent = Client.at(opponentId);
    if (!opponent) {
      return ;
    }
    client.cancelChallenge(clientSocket.id)
    opponent.removeInvitation(client.id);
    this.logger.log(`Challenge cancelled: ${client.id} VS ${opponent.id}`);
  }

  public challengeList(clientSocket: Socket): number[] {
    const client = Client.at(clientSocket);
    if (!client) {
      return [];
    }
    return client.invitations;
  }

  public acceptChallenge(server: Server, clientSocket: Socket, opponentId: number) {
    const left = Client.at(opponentId);
    if (!left) {
      return ;
    }
    const right = Client.at(clientSocket);
    if (!right) {
      return ;
    }        
    if (right.hasInvitation(left.id)) {
      this.startGame(server, left, right, GAMETYPE_CASUAL);
      return 'started';
    }
    return 'cancelled';
  }
}
