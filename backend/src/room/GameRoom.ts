import { Logger } from "@nestjs/common";
import { Server } from "socket.io";
import Client, { STATUS_ONLINE, STATUS_PLAYING } from "../pong/Client/Client";
import { GameState, IGameState } from "../pong/Game";
import { Player } from "../pong/Game";
import Elo from "../pong/Matchmaking/Elo";
import { UsersService } from "src/users/users.service";
import { RoomService } from "./room.service";
import { User } from "src/users/entities/user.entity";

export interface IGameRoom {
  id: number,
  left: User,
  right: User,
  gameState: IGameState,
}

class GameRoom {
  /** This set contains all the current rooms. */
  private static __rooms_: Set<GameRoom> = new Set<GameRoom>;
  private readonly logger: Logger = new Logger("Room");

  private readonly _id: number;
  private _left: Client;
  private _right: Client;
  private _spectators: Client[];
  private _gameState: GameState;

  private constructor(
    id: number,
    left: Client | null = null,
    right: Client | null = null,
  ) {
    this._id = id;
    if (left) {
      this.join(left);
    }
    if (right) {
      this.join(right);
    }
    this._gameState = new GameState();
    this._spectators = [];
  }

  public get id(): number { return this._id; }
  public get left(): Client { return this._left; }
  public get right(): Client { return this._right; }
  public get gameState(): GameState { return this._gameState; }

  // public set id(id: number) { this._id = id; }
  public set left(left: Client) { this._left = left; }
  public set right(right: Client) { this._right = right; }
  public set gameState(gameState: GameState) { this._gameState = gameState; }

  public handleKey(client: Client, direction: string, isPressed: boolean) {
    if (!this._left || !this._right) {
      return;
    }
    if (this._left.socket && this._right && client.socket) {
      const player: Player = client.socket.id === this._left.socket.id ? this._gameState.leftPlayer : this._gameState.rightPlayer;

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

  public async endGame(server: Server, usersService: UsersService, roomService: RoomService) {
    if (!this._left || !this._right) {
      return;
    }
    usersService.update(this._left.user.id, { status: STATUS_ONLINE });
    usersService.update(this._right.user.id, { status: STATUS_ONLINE });
    this.gameState.gameOver = true;

    server.to(this._id.toString()).emit('endGame', this.gameState.IGameState());

    if (this._gameState.interval) {
      clearInterval(this._gameState.interval);
    }
    const [newLeftRating, newRightRating] = Elo.updateRatings(this._left.user.rating, this._right.user.rating, this._gameState.leftPlayer.score > this._gameState.rightPlayer.score);
    usersService.update(this._left.user.id, { rating: newLeftRating });
    usersService.update(this._right.user.id, { rating: newRightRating });
    roomService.update(
      this._id,
      {
        left: this._left.user,
        right: this._right.user,
        gameState: this._gameState.IGameState(),
      });
    this.logger.log(`Game ended (room: ${this._id}).`);
    this.logger.log(`Ratings updated (left: ${newLeftRating}, right: ${newRightRating})`);
    GameRoom.delete(this);
  }

  private _emitGame(server: Server, leftPlayer: Client, rightPlayer: Client) {
    const room = {
      id: this._id,
      left: leftPlayer.user,
      right: rightPlayer.user,
      gameState: this._gameState.IGameState(),
    }
    server.to(this._id.toString()).emit('update', room);
  }

  public startGame(server: Server, usersService: UsersService, roomService: RoomService): boolean {
    if (!this._left || !this._right) {
      return false;
    }
    const leftPlayer: Client = this._left;
    const rightPlayer: Client = this._right;
    usersService.update(leftPlayer.user.id, { status: STATUS_PLAYING });
    usersService.update(rightPlayer.user.id, { status: STATUS_PLAYING });
    server.to(this._id.toString()).emit('startGame', { roomId: this._id });
    this._emitGame(server, leftPlayer, rightPlayer);
    setTimeout(() => {
      this._gameState.previous = Date.now();
      this._gameState.interval = setInterval(() => {
        this._gameState.current = Date.now();
        this._gameState.deltaTime = (this._gameState.current - this._gameState.previous) / 1000;
        if (this._gameState.gameOver) {
          this.endGame(server, usersService, roomService);
        }
        this._gameState.update();
        this._emitGame(server, leftPlayer, rightPlayer);
        if (leftPlayer.socket && rightPlayer.socket) {
          if (leftPlayer.socket.disconnected && rightPlayer.socket.disconnected) {
            this.abortGame();
          }
        }
        this._gameState.previous = Date.now();
      }, 1000 / this._gameState.fps);
    }, 1000);

    this.logger.log(`Game started (room: ${this._id}, left: ${leftPlayer.user.id}, right: ${rightPlayer.user.id}).`);
    return true;
  }

  public join(client: Client): boolean {
    if (!client || !client.socket) {
      return false;
    }
    if (!this._left) {
      this._left = client;
      this._left.socket!.join(this._id.toString());
      return true;
    }
    if (!this._right) {
      this._right = client;
      this._right.socket!.join(this._id.toString());
      return true;
    }
    return false;
  }

  public addSpectator(client: Client) {
    if (!client.socket) {
      return;
    }
    client.socket.join(this._id.toString());
    this._spectators.push(client);
  }

  public removeSpectator(client: Client) {
    if (!client.socket) {
      return;
    }
    client.socket.leave(this._id.toString());
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
      if (client.user.id === this._left.user.id && this._left.socket) {
        this._left.socket.leave(this._id.toString());
        return true;
      }
    }
    if (this._right) {
      if (client.user.id === this._right.user.id && this._right.socket) {
        this._right.socket.leave(this._id.toString());
      }
      return true;
    }
    return false;
  }

  public static async new(roomService: RoomService, left: Client, right: Client) {
    const promise = await roomService.create(left.user, right.user, {} as GameState);
    const room = new GameRoom(promise.id, left, right);
    GameRoom.__rooms_.add(room);
    return room;
  }

  public static with(client: Client): GameRoom | null {
    for (const room of GameRoom.__rooms_.values()) {
      if ((room._left && room._left.user.id === client.user.id)
        || (room._right && room._right.user.id === client.user.id)) {
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

  public IGameRoom(): IGameRoom {
    const iGameRoom: IGameRoom = {
      id: this._id,
      left: this._left.user,
      right: this._right.user,
      gameState: this._gameState.IGameState(),
    };
    return iGameRoom;
  }
}

export default GameRoom;