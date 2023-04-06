import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ClientData, GameState, IGameState } from './game/GameState';

interface RoomData {
  id: number;
  left: ClientData;
  right: ClientData;
  gameState: GameState;
}

interface IClientData {
  name: string,
  avatar: string | null,
}

/* Object type - we emit this to clients */
export interface IRoomData {
  id: number,
  left: IClientData,
  right: IClientData,
  gameState: IGameState,
}

@Injectable()
export class PongService {
  private clients: Set<ClientData> = new Set();
  private queue: Set<ClientData> = new Set();
  private rooms: Set<RoomData> = new Set();
  private readonly logger = new Logger();

  constructor() {
    // setInterval(() => {
    //   process.stdout.write('\x1b[2J\x1b[H');
    //   for (const roomData of this.rooms.values()) {
    //     process.stdout.write(`Room ${roomData.id} - FPS: ${(1.0 / roomData.gameState.deltaTime).toFixed(1)}\n`);
    //   }
    // }, 1000);
  }

  public getQueue(): ClientData[] {
    return [...this.queue];
  }

  public getRoomList(): IRoomData[] {
    const roomList: IRoomData[] = [];
    this.rooms.forEach(room => {
      const roomData: IRoomData = {
        id: room.id,
        left: {name: room.left.name, avatar: room.left.avatar},
        right: {name: room.right.name, avatar: room.right.avatar},
        gameState: room.gameState.IGameState(),
      }
      roomList.push(roomData);
    });
    console.log(roomList);
    return roomList;
  }

  private _getNewRoomId(): number {
    let smallestMissingId = 0;
    for (const roomData of this.rooms.values()) {
      if (roomData.id === smallestMissingId) {
        smallestMissingId++;
      }
      else if (smallestMissingId < roomData.id && !!(this.__getRoom(smallestMissingId))) {
        break;
      }
    }
    return smallestMissingId;
  }

  private _getNewClientId(): number {
    let smallestMissingId = 0;
    for (const clientData of this.clients.values()) {
      if (clientData.id === smallestMissingId) {
        smallestMissingId++;
      }
      else if (smallestMissingId < clientData.id && !!(this.__getClient(smallestMissingId))) {
        break;
      }
    }
    return smallestMissingId;
  }

  /**
   * @param socket The client socket.
   * @returns The clientData element corresponding to the socket, or undefined if the element does not exist.
   */
  private __getClientFromSocket(socket: Socket): ClientData | undefined {
    for (const clientData of this.clients.values()) {
      if (clientData.__socket.id === socket.id) {
        return clientData;
      }
    }
    return undefined;
  }
  
  /**
   * @param clientId The desired client id.
   * @returns The clientData element with the given id, or undefined if the element does not exist.
   */
  private __getClient(clientId: number): ClientData | undefined {
    for (const clientData of this.clients.values()) {
      if (clientData.id === clientId) {
        return clientData;
      }
    }
    return undefined;
  }

  /**
   * @param roomId The desired room id.
   * @returns The roomData element with the given id, or undefined if the element does not exist.
   */
  private __getRoom(roomId: number): RoomData | undefined {
    for (const roomData of this.rooms.values()) {
      if (roomData.id === roomId) {
        return roomData;
      }
    }
    return undefined;
  }

  /**
   * @param socket The client socket.
   * @returns The room that the client is currently in, or undefined if the client is not in a room.
   */
  private __getSocketRoom(socket: Socket): RoomData | undefined {
    for (const roomData of this.rooms.values()) {
      if (roomData.left.__socket.id === socket.id || roomData.right.__socket.id === socket.id) {
        return roomData;
      }
    }
    return undefined;
  }

  public async handleUserConnected(client: Socket): Promise<void> {
    const clientData: ClientData = {
      __socket: client,
      id: this._getNewClientId(),
      name: client.data.name,
      avatar: null,
      backgroundColor: 'black',
      status: 'online',
    }

    this.clients.add(clientData);
    this.logger.verbose(`Client connected (${clientData.id}:${client.data.name}).`);
  }

  public async handleUserDisconnect(client: Socket): Promise<void> {
    const clientData = this.__getClientFromSocket(client);

    if (clientData) {
      this.queue.delete(clientData);
      this.clients.delete(clientData);
      this.logger.verbose(`Client disconnected (${clientData.id}).`);
    }
  }

  private _handleKey(client: Socket, direction: string, isPressed: boolean) {
    const room = this.__getSocketRoom(client);

    if (room) {
      const player = client.id === room.left.__socket.id ? room.gameState.leftPlayer : room.gameState.rightPlayer;
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

  public handleKeyUpPressed(client: Socket) { this._handleKey(client, "up", true); }
  public handleKeyUpUnpressed(client: Socket) { this._handleKey(client, "up", false); }
  public handleKeyDownPressed(client: Socket) { this._handleKey(client, "down", true); }
  public handleKeyDownUnpressed(client: Socket) { this._handleKey(client, "down", false); }

  private _destroyRoom(room: RoomData) {
    room.left.__socket.leave(room.id.toString());
    room.left.__socket.leave(room.id.toString());
    if (room.gameState.interval) {
      clearInterval(room.gameState.interval);
    }
    this.rooms.delete(room);
  }

  private _createRoom(left: ClientData, right: ClientData): RoomData {
    const roomId = this._getNewRoomId();
    const gameState = new GameState(left, right);

    left.__socket.join(roomId.toString());
    right.__socket.join(roomId.toString());
    left.__socket.data.isLeft = true;
    right.__socket.data.isLeft = false;
    left.__socket.data.room = roomId;
    right.__socket.data.room = roomId;

    const roomData: RoomData = {
      id: roomId,
      left: left,
      right: right,
      gameState: gameState,
    }

    this.rooms.add(roomData);
    return roomData;
  }

  public startGame(server: Server, left: ClientData, right: ClientData) {
    const room: RoomData = this._createRoom(left, right);
    this.queue.delete(left);
    this.queue.delete(right);
    room.left.status = 'playing';
    room.right.status = 'playing';

    server.to(room.id.toString()).emit('startGame', { roomId: room.id });

    room.gameState.previous = Date.now();
    room.gameState.interval = setInterval(() => {
      room.gameState.current = Date.now();
      room.gameState.deltaTime = (room.gameState.current - room.gameState.previous) / 1000;
      
      if (room.gameState.gameOver) {
        this.endGame(server, room);
      }

      room.gameState.update();

      const roomData: IRoomData = {
        id: room.id,
        left: {name: room.left.name, avatar: room.left.avatar},
        right: {name: room.right.name, avatar: room.right.avatar},
        gameState: room.gameState.IGameState(),
      }
      server.to(room.id.toString()).emit('update', roomData);

      // if (room.left.__socket.disconnected || room.right.__socket.disconnected) {
      //   this.endGame(server, room);
      // }

      room.gameState.previous = Date.now();
    }, 1000 / room.gameState.fps);
    this.logger.log(`Started new game (room: ${room.id}, left: ${room.left.id}), right: ${room.right.id}`);
  }

  endGame(server: Server, room: RoomData) {
    server.to(room.id.toString()).emit('endGame', room.gameState.IGameState());
    room.left.status = 'online';
    room.right.status = 'online';
    this._destroyRoom(room);
    this.logger.log(`Ended game (id: ${room.id})`);
  }

  addClientToQueue(client: Socket) {
    const clientData = this.__getClientFromSocket(client);
    if (clientData) {
      const room = this.__getSocketRoom(client);
      if (room) {
        client.emit('startGame', { roomId: room.id });
        return ;
      }

      if (this.queue.has(clientData)) {
        return ;
      }
      this.queue.add(clientData);
      this.logger.verbose(`Added client to queue (${clientData.id}).`);
    }
  }

  public removeClientFromQueue(client: Socket) {
    const clientData = this.__getClientFromSocket(client);
    if (clientData) {
      if (!this.queue.has(clientData)) {
        return ;
      }
      this.queue.delete(clientData);
      this.logger.verbose(`Removed client from queue (${clientData.id}).`);
    }
  }
}