import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameState } from './game/GameState';

interface ClientData {
  id: number,
  name: string,
}

interface RoomData {
  id: string,
  left: Socket,
  right: Socket,
  gameState: GameState;
  interval: NodeJS.Timer | null;
}

@Injectable()
export class PongService {
  private clients: Map<string, ClientData> = new Map();
  private queue: Set<Socket> = new Set();
  private rooms: Set<RoomData> = new Set();
  private readonly logger = new Logger();

  constructor() {
  }

  async handleUserConnected(client: Socket, clientData: ClientData): Promise<void> {
    this.logger.verbose(`Client connected (${clientData.id}:${client.data.name}).`);
    this.clients.set(client.id, clientData);
  }

  async handleUserDisconnect(client: Socket): Promise<void> {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      this.removeClientFromQueue(client);
      this.clients.delete(client.id);
      this.logger.verbose(`Client disconnected (${clientData.id}).`);
    }
  }

  __roomAt_(id: string | undefined): RoomData | undefined {
    if (id) {
      for (const roomData of this.rooms.values()) {
        if (roomData.id === id) {
          return roomData;
        }
      }
    }
    return undefined;
  }

  __clientAt_(id: number | undefined): ClientData | undefined {
    if (id) {
      for (const clientData of this.clients.values()) {
        if (clientData.id === id) {
          return clientData;
        }
      }
    }
    return undefined;
  }

  getQueueSize() {
    return this.queue.size;
  }

  getQueue() {
    return [...this.queue];
  }

  handleKey(client: Socket, direction: string, isPressed: boolean) {
    const clientRooms: string[] = [...client.rooms];
    const room = this.__roomAt_(clientRooms.at(1));

    if (room) {
      const player = client.id === room?.left.id ? room.gameState.leftPlayer : room.gameState.rightPlayer;
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

  handleKeyUpPressed(client: Socket) { this.handleKey(client, "up", true); }
  handleKeyUpUnpressed(client: Socket) { this.handleKey(client, "up", false); }
  handleKeyDownPressed(client: Socket) { this.handleKey(client, "down", true); }
  handleKeyDownUnpressed(client: Socket) { this.handleKey(client, "down", false); }

  getNewRoomId(): string {
    let smallestMissingId = 0;
    for (const roomData of this.rooms.values()) {
      if (roomData.id === smallestMissingId.toString()) {
        smallestMissingId++;
      }
      else if (smallestMissingId.toString() < roomData.id && !!(this.__roomAt_(smallestMissingId.toString()))) {
        break;
      }
    }
    return smallestMissingId.toString();
  }

  getNewClientId(): number {
    let smallestMissingId = 0;
    for (const clientData of this.clients.values()) {
      if (clientData.id === smallestMissingId) {
        smallestMissingId++;
      }
      else if (smallestMissingId < clientData.id && !!(this.__clientAt_(smallestMissingId))) {
        break;
      }
    }
    return smallestMissingId;
  }

  createNewRoom(left: Socket, right: Socket): RoomData {
    const roomId = this.getNewRoomId();
    const gameState = new GameState(650, 480);

    left.join(roomId);
    right.join(roomId);
    left.data.isLeft = true;
    right.data.isLeft = false;
    left.data.room = roomId;
    right.data.room = roomId;
    left.data.opponentId = right.id;
    right.data.opponentId = left.id;

    return {
      id: roomId,
      left: left,
      right: right,
      gameState: gameState,
      interval: null,
    };
  }

  startGame(server: Server, left: Socket, right: Socket) {
    const room: RoomData = this.createNewRoom(left, right);
    this.rooms.add(room);

    this.removeClientFromQueue(left);
    this.removeClientFromQueue(right);

    server.to(room.id).emit('startGame', { roomId: room.id });
    room.interval = setInterval(() => {
      room.gameState.update();
      server.to(room.id).emit('update', room.gameState.IGameState());

      if (room.left.disconnected || room.right.disconnected) {
        this.endGame(server, room);
      }
    }, 1000 / 60);
    this.logger.log(`Started new game (id: ${room.id})`);
  }

  endGame(server: Server, room: RoomData) {
    server.to(room.id).emit('end');
    if (room.interval) {
      clearInterval(room.interval);
    }
    this.rooms.delete(room);
    this.logger.log(`Ended game (id: ${room.id})`);
  }

  addClientToQueue(server: Server, client: Socket): string {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      if (this.queue.has(client)) {
        return 'already in queue';
      }
      this.queue.add(client);
      this.logger.verbose(`Added client to queue (${clientData.id}).`);
      return 'ok';
    }
    return 'unknown client';
  }

  removeClientFromQueue(client: Socket): string {
    const clientData = this.clients.get(client.id);
    if (clientData) {
      if (!this.queue.has(client)) {
        return 'not in queue';
      }
      this.queue.delete(client);
      this.logger.verbose(`Removed client from queue (${clientData.id}).`);
      return 'ok';
    }
    return 'unknown client';
  }
}
