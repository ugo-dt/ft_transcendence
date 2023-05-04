import { Logger } from "@nestjs/common";
import { Server } from "socket.io";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/entities/user.entity";
import { RoomService } from "./room.service";
import { GameState, IGameState } from "../pong/Game";
import { Player } from "../pong/Game";
import Client from "../Client/Client";
import Elo from "../pong/Matchmaking/Elo";

export const GAMETYPE_RANKED = 'ranked';
export const GAMETYPE_CASUAL = 'casual';
export type GameType = typeof GAMETYPE_RANKED | typeof GAMETYPE_CASUAL;

export interface IGameRoom {
  id: number,
  left: User,
  right: User,
  gameState: IGameState,
}

class GameRoom {
  /** This set contains all the currently active rooms. */
  private static __rooms_: Set<GameRoom> = new Set<GameRoom>;
  private readonly logger: Logger = new Logger("GameRoom");

  private readonly _id: number;
  private _left: Client;
  private _right: Client;
  private _spectators: Client[];
  private _gameState: GameState;
  private _type: GameType;

  private constructor(
    id: number,
    left: Client | null = null,
    right: Client | null = null,
    type: GameType,
    leftColor: string,
    rightColor: string,
  ) {
    this._id = id;
    if (left) {
      this.join(left);
    }
    if (right) {
      this.join(right);
    }
    this._gameState = new GameState(leftColor, rightColor);
    this._spectators = [];
    this._type = type;
  }

  public get id(): number { return this._id; }
  public get left(): Client { return this._left; }
  public get right(): Client { return this._right; }
  public get gameState(): GameState { return this._gameState; }

  public set left(left: Client) { this._left = left; }
  public set right(right: Client) { this._right = right; }
  public set gameState(gameState: GameState) { this._gameState = gameState; }

  public handleKey(clientId: number, direction: string, isPressed: boolean) {
    if (!this._left || !this._right) {
      return;
    }
    if (this._left.sockets.length && this._right.sockets.length) {
      const player: Player = clientId === this._left.id ? this._gameState.leftPlayer : this._gameState.rightPlayer;

      if (direction === "up") {
        if (isPressed) {
          player.handleKeyUpPressed();
        }
        else {
          player.handleKeyUpUnpressed();
        }
      } else {
        if (isPressed) {
          player.handleKeyDownPressed();
        }
        else {
          player.handleKeyDownUnpressed();
        }
      }
    }
  }

  public abortGame() {
    if (this._gameState.interval) {
      clearInterval(this._gameState.interval);
    }
    this.logger.log(`Game aborted (room: ${this._id}). Both players disconnected.`);
    GameRoom.delete(this);
  }

  private async _updateRatings(usersService: UsersService) {
    const [newLeftRating, newRightRating] = Elo.updateRatings(
      await usersService.getRating(this._left.id),
      await usersService.getRating(this._right.id),
      this._gameState.leftPlayer.score > this._gameState.rightPlayer.score
    );

    usersService.setRating(this._left.id, newLeftRating);
    usersService.setRating(this._right.id, newRightRating);
    this.logger.log(`Ratings updated (left: ${newLeftRating}, right: ${newRightRating})`);
  }

  public async endGame(server: Server, usersService: UsersService, roomService: RoomService) {
    if (!this._left || !this._right) {
      return;
    }
    this.gameState.gameOver = true;
    this.logger.log(`Game ended (room: ${this._id}).`);
    if (this._left.sockets.length && this._left.sockets.length) {
      usersService.setOnline(this._left.id);
    }
    else {
      usersService.setOffline(this._left.id);
    }
    if (this._right.sockets.length && this._right.sockets.length) {
      usersService.setOnline(this._right.id);
    }
    else {
      usersService.setOffline(this._right.id);
    }
    server.to(this._id.toString()).emit('endGame', this.gameState.IGameState());
    if (this._gameState.interval) {
      clearInterval(this._gameState.interval);
    }
    if (this._type === GAMETYPE_RANKED) {
      this._updateRatings(usersService);
    }
    roomService.update(
      this._id,
      {
        left: this._left.id,
        right: this._right.id,
        gameState: this._gameState.IGameState(),
      });
    GameRoom.delete(this);
  }

  private _emitGame(server: Server, left: User, right: User) {
    const room = {
      id: this._id,
      left: left,
      right: right,
      gameState: this._gameState.IGameState(),
    }
    server.to(this._id.toString()).emit('update', room);
  }

  public async startGame(server: Server, usersService: UsersService, roomService: RoomService) {
    if (!this._left || !this._right) {
      return;
    }
    const leftUser = await usersService.findOneId(this._left.id);
    if (!leftUser) {
      return;
    }
    const rightUser = await usersService.findOneId(this._right.id);
    if (!rightUser) {
      return;
    }
    const leftClient: Client = this._left;
    const rightClient: Client = this._right;
    usersService.setInGame(leftClient.id);
    usersService.setInGame(rightClient.id);
    server.to(this._id.toString()).emit('startGame', { roomId: this._id });
    this._emitGame(server, leftUser, rightUser);
    setTimeout(() => {
      this._gameState.previous = Date.now();
      this._gameState.interval = setInterval(() => {
        this._gameState.current = Date.now();
        this._gameState.deltaTime = (this._gameState.current - this._gameState.previous) / 1000;
        if (this._gameState.gameOver) {
          this.endGame(server, usersService, roomService);
        }
        this._gameState.update();
        this._emitGame(server, leftUser, rightUser);
        if (!leftClient.sockets.length && !rightClient.sockets.length) {
          this.abortGame();
        }
        this._gameState.previous = Date.now();
      }, 1000 / this._gameState.fps);
    }, 1000);

    this.logger.log(`Game started (room: ${this._id}, left: ${leftClient.id}, right: ${rightClient.id}).`);
  }

  public join(client: Client): boolean {
    if (!client || !client.sockets.length) {
      return false;
    }
    if (!this._left) {
      this._left = client;
      this._left.joinRoom(this._id);
      return true;
    }
    if (!this._right) {
      this._right = client;
      this._right.joinRoom(this._id);
      return true;
    }
    return false;
  }

  public addSpectator(client: Client) {
    if (!client.sockets.length) {
      return;
    }
    client.joinRoom(this._id);
    this._spectators.push(client);
  }

  public removeSpectator(client: Client) {
    if (!client.sockets.length) {
      return;
    }
    client.leaveRoom(this._id);
    const index = this._spectators.indexOf(client);
    if (index > -1) {
      this._spectators.splice(index, 1);
    }
  }

  public leave(client: Client | null) {
    if (!client) {
      return;
    }
    if (this._left) {
      if (client.id === this._left.id) {
        this._left.leaveRoom(this._id);
        return true;
      }
    }
    if (this._right) {
      if (client.id === this._right.id) {
        this._right.leaveRoom(this._id);
      }
      return true;
    }
    return false;
  }

  public static async new(roomService: RoomService, left: Client, right: Client, type: GameType, leftColor: string, rightColor: string) {
    const promise = await roomService.create(left.id, right.id, {} as GameState);
    const room = new GameRoom(promise.id, left, right, type, leftColor, rightColor);
    GameRoom.__rooms_.add(room);
    return room;
  }

  public static with(client: Client): GameRoom | null {
    for (const room of GameRoom.__rooms_.values()) {
      if ((room._left && room._left.id === client.id)
        || (room._right && room._right.id === client.id)) {
        return room;
      }
    }
    return null;
  }

  public static at(id: number): GameRoom | null {
    if (typeof id === 'number') {
      for (const room of GameRoom.__rooms_.values()) {
        if (room._id === id) {
          return room;
        }
      }
    }
    return null;
  }

  public static delete(room: GameRoom): void;
  public static delete(room: number): void;
  public static delete(x: number | GameRoom): void {
    let _delete_id: number;

    if (typeof x === 'number') {
      _delete_id = x;
    }
    else {
      _delete_id = x.id;
    }
    for (const room of GameRoom.__rooms_.values()) {
      if (room.id === _delete_id) {
        room.leave(room._left);
        room.leave(room._right);
        room._spectators.forEach((spec) => {
          room.removeSpectator(spec);
        });
        GameRoom.__rooms_.delete(room);
        return;
      }
    }
  }

  public static list(): GameRoom[] {
    return Array.from(GameRoom.__rooms_);
  }

  public IGameRoom(leftUser: User, rightUser: User): IGameRoom {
    const iGameRoom: IGameRoom = {
      id: this._id,
      left: leftUser,
      right: rightUser,
      gameState: this._gameState.IGameState(),
    };
    return iGameRoom;
  }
}

export default GameRoom;