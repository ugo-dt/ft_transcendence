import { Server } from "socket.io";
import Client, { STATUS_ONLINE } from "../Client/Client";
import { GameState } from "../Game/GameState";
import Queue from "../Matchmaking/Queue";

class Room {
  /** This set contains the ids of all current rooms. */
  public static __rooms_ = new Set<Room>;

  private readonly _id: number;
  private _left: Client | null;
  private _right: Client | null;
  // private _spectators: Set<Client>;

  private _gameState: GameState;

  private __newId(): number {
    let _new_id = 0;
    for (const room of Room.__rooms_.values()) {
      if (room._id != _new_id && !(Room.at(_new_id))) {
        break ;
      }
      _new_id++;
    }
    return _new_id;
  }

  private constructor(
    left: Client | null = null,
    right: Client | null = null,
  ) {
    this._id = this.__newId();
    if (left) {
      this.join(left);
    }
    if (right) {
      this.join(right);
    }
  }

  public get id(): number { return this._id; }
  public get left(): Client | null { return this._left; }
  public get right(): Client | null { return this._right; }
  public get gameState(): GameState { return this._gameState; }

  // public set id(id: number) { this._id = id; }
  public set left(left: Client | null) { this._left = left; }
  public set right(right: Client | null) { this._right = right; }
  public set gameState(gameState: GameState) { this._gameState = gameState; }

  public endGame(server: Server) {
    if (!this._left || !this._right) {
      return ;
    }
    this._left.status = STATUS_ONLINE;
    this._right.status = STATUS_ONLINE;

    server.to(this._id.toString()).emit('endGame', this.gameState.IGameState());
    console.log(`Ended game (id: ${this._id})`);
  }

  public startGame(server: Server): boolean {
    if (!this._left || !this._right) {
      return false;
    }
    const leftPlayer: Client = this._left;
    const rightPlayer: Client = this._right;
    this._gameState = new GameState(leftPlayer, rightPlayer);

    server.to(this._id.toString()).emit('startGame', { roomId: this._id });
    this._gameState.previous = Date.now();
    this._gameState.interval = setInterval(() => {
      this._gameState.current = Date.now();
      this._gameState.deltaTime = (this._gameState.current - this._gameState.previous) / 1000;
      if (this._gameState.gameOver) {
        this.endGame(server);
      }
      this._gameState.update();
      const room = {
        id: this._id,
        left: {id: leftPlayer.id, name: leftPlayer.name, avatar: leftPlayer.avatar},
        right: {id: rightPlayer.id, name: rightPlayer.name, avatar: rightPlayer.avatar},
        gameState: this._gameState.IGameState(),
      }
      server.to(this._id.toString()).emit('update', room);
      this._gameState.previous = Date.now();
    }, 1000 / this._gameState.fps);
    console.log(`Started new game (room: ${this._id}, left: ${leftPlayer.id}, right: ${rightPlayer.id})`);
    return true;
  }
  
  public join(client: Client): boolean {
    if (!this._left) {
      this._left = client;
      this._left.__socket.join(this._id.toString());
      return true;
    }
    if (!this._right) {
      this._right = client;
      this._right.__socket.join(this._id.toString());
      return true;
    }
    return false;
  }
  
  public leave(client: Client | null) {
    if (this._left) {
      this._left.__socket.leave(this._id.toString());
      return true;
    }
    if (this._right) {
      this._right.__socket.leave(this._id.toString());
      return true;
    }
    return false;
  }

  public static new(left: Client | null = null, right: Client | null = null): Room {
    const room: Room = new Room(left, right);
    Room.__rooms_.add(room);
    return room;
  }

  public static with(client: Client): Room | undefined {
    for (const room of Room.__rooms_.values()) {
      if ((room._left && room._left.id === client.id) || (room._right && room._right.id === client.id)) {
        return room;
      }
    }
    return undefined;
  }
  
  public static at(id: number): Room | undefined {
    if (typeof id === 'number') {
      for (const room of Room.__rooms_.values()) {
        if (room._id === id) {
          return room;
        }
      }
    }
    return undefined;
  }

  public static remove(id: number) {
    for (const room of Room.__rooms_.values()) {
      if (room._id === id) {
        room.leave(room._left);
        room.leave(room._right);
        Room.__rooms_.delete(room);
      }
    }
  }

  public static list() {
    return Array.from(Room.__rooms_);
  }
}

export default Room;