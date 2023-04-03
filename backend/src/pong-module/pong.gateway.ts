import { Logger } from "@nestjs/common";
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";

// @WebSocketGateway({
//   namespace: 'pong',
//   cors: ['*'],
// })
// export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() wss: Server;
//   readonly logger = new Logger();
//   private players: Socket[];

//   constructor(private pongService: PongService) {
//     this.players = [];
//   }

//   async handleConnection(client: Socket) {
//     await this.pongService.handleUserConnected(this.wss, client, this.players);
//     this.logger.verbose(`New socket connected (id: ${client.id})`)
//   }

//   async handleDisconnect(client: Socket) {
//     await this.pongService.handleUserDisconnect(this.wss, client);
//     this.logger.verbose(`Socket disconnected (id: ${client.id})`)
//   }

//   joinQueue(client: Socket, name: string) {
//     client.data.name = name;
//     this.players.push(client);
//     this.logger.verbose(`Added ${client.id} to queue.`);
//   }

//   leaveQueue(client: Socket) {
//     this.players = this.players.filter((clt) => {
//       return clt.id !== client.id;
//     })
//     this.logger.verbose(`Removed ${client.id} from queue.`);
//   }

//   startGame(left: Socket, right: Socket) {
//     const gameId = left.id + right.id;

//     left.join(gameId);
//     right.join(gameId);
//     left.data.room = gameId;
//     right.data.room = gameId;
//     left.data.opponentId = right.id;
//     right.data.opponentId = left.id;

//     const gameState = new GameState(650, 480);
//     left.data.isLeft = true;
//     right.data.isLeft = false;
//     left.data.gameState = gameState;
//     right.data.gameState = gameState;

//     this.logger.log(left.data);

//     this.wss.emit('start');
//     const interval = setInterval(() => {
//       gameState.update();
//       this.wss.to(gameId).emit('update', gameState.IGameState());

//       if (!left.connected || !right.connected) {
//         this.endGame(left, right);
//       }
//     }, 1000 / 60);
//     left.data.interval = interval;
//     right.data.interval = interval;
//   }

//   endGame(left: Socket, right: Socket) {
//     this.wss.emit('end');
//     clearInterval(left.data.interval);
//   }

//   @SubscribeMessage('queue')
//   handleQueueActions(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
//     if (data.action) {
//       if (data.action === "join") {
//         this.joinQueue(client, data.name);
//         this.logger.verbose(this.players.length);
//         if (this.players.length === 2) {
//           this.startGame(this.players[0], this.players[1]);
//         }
//       }
//       else if (data.action === "leave") {
//         this.leaveQueue(client);
//       }
//     }
//   }

//   @SubscribeMessage('game')
//   handleGameActions(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
//     if (data.action) {
//       if (data.action === "leave") {
//         this.endGame(this.players[0], this.players[1]);
//       }
//     }
//   }

//   @SubscribeMessage('upKeyPressed')
//   handleKeyUpPressed(@ConnectedSocket() client: Socket) {
//     if (client.data) {
//       this.logger.log(client.data.gameState.leftPlayer.keyboardState);
//     }
//     if (client.data) {
//       if (client.data.isLeft) {
//         client.data.gameState.leftPlayer.handleKeyUpPressed();
//       }
//       else {
//         client.data.gameState.rightPlayer.handleKeyUpPressed();
//       }
//     }
//   }

//   // @SubscribeMessage('upKeyUnpressed')
//   // handleKeyUpUnpressed(@ConnectedSocket() client: Socket) {
//   //   if (client.data.gameState) {
//   //     if (client.data.isLeft) {
//   //       client.data.gameState.leftPlayer.handleKeyUpUnpressed();
//   //     }
//   //     else {
//   //       client.data.gameState.rightPlayer.handleKeyUpUnpressed();
//   //     }
//   //   }
//   // }

//   // @SubscribeMessage('downKeyPressed')
//   // handleKeyDownPressed(@ConnectedSocket() client: Socket) {
//   //   if (client.data.gameState) {
//   //     if (client.data.isLeft) {
//   //       client.data.gameState.leftPlayer.handleKeyDownPressed();
//   //     }
//   //     else {
//   //       client.data.gameState.rightPlayer.handleKeyDownPressed();
//   //     }
//   //   }
//   // }

//   // @SubscribeMessage('downKeyUnpressed')
//   // handleKeyDownUnpressed(@ConnectedSocket() client: Socket) {
//   //   if (client.data.gameState) {
//   //    if (client.data.isLeft) {
//   //     client.data.gameState.leftPlayer.handleKeyDownUnpressed();
//   //     }
//   //     else {
//   //       client.data.gameState.rightPlayer.handleKeyDownUnpressed();
//   //     }
//   //   }
//   // }
// }

@WebSocketGateway({
  namespace: 'pong',
  cors: ['*'],
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger();

  constructor(private readonly pongService: PongService) {
    
    setInterval(() => {
      if (this.pongService.getQueueSize() >= 2) {
        const _qu = this.pongService.getQueue();
        this.pongService.startGame(this.server, _qu[0], _qu[1]);
      }
    }, 1000);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    client.data.name = 'name'; // get name from db later.
    this.pongService.handleUserConnected(client, {
      id: this.pongService.getNewClientId(),
      name: client.data.name,
    });
  }
  
  async handleDisconnect(client: Socket) {
    this.pongService.handleUserDisconnect(client);
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.pongService.addClientToQueue(this.server, client);
  }

  @SubscribeMessage('leave-queue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.pongService.removeClientFromQueue(client);
  }

  @SubscribeMessage('upKeyPressed')
  handleKeyUpPressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKeyUpPressed(client);
  }

  @SubscribeMessage('upKeyUnpressed')
  handleKeyUpUnpressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKeyUpUnpressed(client);
  }

  @SubscribeMessage('downKeyPressed')
  handleKeyDownPressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKeyDownPressed(client);
  }

  @SubscribeMessage('downKeyUnpressed')
  handleKeyDownUnpressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKeyDownUnpressed(client);
  }
}
