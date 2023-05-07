import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client from '../Client/Client';
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
    if (await this.usersService.isOffline(user.id)) {
      await this.usersService.setOnline(user.id);
    }
    const client = Client.at(user.id);
    if (!client) {
      Client.new(user.id, clientSocket);
    }
    else {
      client.addSocket(clientSocket);
    }
    clientSocket.emit('client-connected', user);
  }

  public async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    this.cancelChallenge(clientSocket);
    client.removeSocket(clientSocket);
    if (client.sockets.length === 0) {
      this.usersService.setOffline(client.id);
    }
    this.removeClientFromQueue(clientSocket);
  }

  public addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || Queue.has(client)) {
      return;
    }
    Queue.add(client);
  }

  public removeClientFromQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client || !Queue.has(client)) {
      return;
    }
    Queue.remove(client);
  }

  public async startGame(server: Server, left: Client, right: Client, type: GameType) {
    Queue.remove(left);
    Queue.remove(right);
    const room = await GameRoom.new(
      this.roomService,
      left,
      right,
      type, await this.usersService.getPaddleColor(left.id),
      await this.usersService.getPaddleColor(right.id)
    );
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
    client.createChallenge(clientSocket.id, opponent.id, false);
    opponent.addInvitation(client.id)
    return 'sent';
  }

  public cancelChallenge(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    const opponentId = client.getChallengeOpponent(clientSocket.id);
    if (opponentId == undefined) {
      return;
    }
    const opponent = Client.at(opponentId);
    if (!opponent) {
      return;
    }
    client.cancelChallenge(clientSocket.id);
    opponent.removeInvitation(client.id);
  }

  public challengeList(clientSocket: Socket): number[] {
    const client = Client.at(clientSocket);
    if (!client) {
      return [];
    }
    return client.invitations;
  }

  public acceptChallenge(server: Server, clientSocket: Socket, opponentId: number): boolean {
    const left = Client.at(opponentId);
    if (!left) {
      return false;
    }
    const right = Client.at(clientSocket);
    if (!right) {
      return false;
    }
    if (right.hasInvitation(left.id)) {
      left.cancelChallenge(clientSocket.id);
      right.removeInvitation(left.id);
      this.startGame(server, left, right, GAMETYPE_CASUAL);
      return true;
    }
    return false;
  }

  public handleRematch(server: Server, clientSocket: Socket, opponentId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    client.wantsRematch = true;
    const opponent = Client.at(opponentId);
    if (!opponent) {
      return;
    }
    if (opponent.wantsRematch) {
      client.wantsRematch = false;
      opponent.wantsRematch = false;
      this.startGame(server, opponent, client, GAMETYPE_RANKED);
      return;
    }
  }

  public cancelRematch(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (!client) {
      return;
    }
    client.wantsRematch = false;
  }
}
