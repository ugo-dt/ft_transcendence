import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Client, { STATUS_PLAYING } from './Client/Client';
import Queue from './Matchmaking/Queue';
import Room from './Room/Room';
import { Player } from './Game/Player';

@Injectable()
export class PongService {
  public static async handleUserConnected(clientSocket: Socket): Promise<void> {
    const client = Client.new(clientSocket);
    if (client) {
      console.log(`Client connected: ${client.name} (id: ${client.id})`);
    }
  }

  public static async handleUserDisconnect(clientSocket: Socket): Promise<void> {
    console.log('Client disconnected: ', Client.at(clientSocket)?.id);
    Client.remove(clientSocket);
  }

  public static addClientToQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (client) {
      Queue.add(client);
      console.log(`Added client ${client.id} to queue.`);
    }
  }

  public static removeClientFromQueue(clientSocket: Socket) {
    const client = Client.at(clientSocket);
    if (client) {
      Queue.remove(client);
      console.log(`Removed client ${client.id} from queue.`);
    }
  }

  public static startGame(server: Server, left: Client, right: Client) {
    Queue.remove(left);
    Queue.remove(right);
    left.status = STATUS_PLAYING;
    right.status = STATUS_PLAYING;
    const room = Room.new(left, right);
    room.startGame(server);
  }

  public endGame(server: Server, roomId: number) {
  }

  private static _handleKey(clientSocket: Socket, direction: string, isPressed: boolean) {
    const client = Client.at(clientSocket);
    if (client) {
      const room = Room.with(client);

      if (room && room.left && room.right) {
        const player: Player = client.__socket.id === room.left.__socket.id ? room.gameState.leftPlayer : room.gameState.rightPlayer;
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
  }

  public static handleKeyUpPressed(client: Socket) { PongService._handleKey(client, "up", true); }
  public static handleKeyUpUnpressed(client: Socket) { PongService._handleKey(client, "up", false); }
  public static handleKeyDownPressed(client: Socket) { PongService._handleKey(client, "down", true); }
  public static handleKeyDownUnpressed(client: Socket) { PongService._handleKey(client, "down", false); }
}
