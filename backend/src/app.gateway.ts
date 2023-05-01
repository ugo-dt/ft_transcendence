import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong/pong.service";
import { Logger } from "@nestjs/common";
import Queue from "./pong/Matchmaking/Queue";
import { ChatService } from "./chat/chat.service";
import { MessageService } from "./chat/message/message.service";
import { ChannelService } from "./chat/channel/channel.service";

@WebSocketGateway({
  namespace: 'app',
  cors: {
    origin: '*',
  }
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger: Logger;

  constructor(
    private readonly pongService: PongService,
    private readonly chatService: ChatService,
  ) {
    this.logger = new Logger("AppGateway");
    setInterval(() => {
      if (Queue.size() >= 2) {
        Queue.tryMatchPlayers(this.server, pongService);
      }
    }, 1000);
    this.logger.log("Initialized queue.");
  }

  public async handleConnection(client: Socket) {
    this.pongService.handleUserConnected(client);
  }

  public async handleDisconnect(client: Socket) {
    this.pongService.handleUserDisconnect(client);
  }

  @SubscribeMessage('join-queue')
  public handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.pongService.addClientToQueue(client);
  }

  @SubscribeMessage('leave-queue')
  public handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.pongService.removeClientFromQueue(client);
  }

  @SubscribeMessage('spectate')
  public handleSpectate(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    if (roomId == null || roomId == undefined) {
      return;
    }
    this.pongService.spectateRoom(client, roomId);
  }

  @SubscribeMessage('stop-spectate')
  public handleStopSpectate(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    if (roomId == null || roomId == undefined) {
      return;
    }
    this.pongService.stopSpectateRoom(client, roomId);
  }

  @SubscribeMessage('game-results')
  public handleGameResults(@MessageBody() roomId: number) {
    return this.pongService.gameResults(roomId);
  }

  @SubscribeMessage('upKeyPressed')
  public handleKeyUpPressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "up", true);
  }

  @SubscribeMessage('upKeyUnpressed')
  public handleKeyUpUnpressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "up", false);
  }

  @SubscribeMessage('downKeyPressed')
  public handleKeyDownPressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "down", true);
  }

  @SubscribeMessage('downKeyUnpressed')
  public handleKeyDownUnpressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "down", false);
  }

  @SubscribeMessage('challenge')
  public handleChallenge(@ConnectedSocket() client: Socket, @MessageBody() opponentId: number) {
    if (opponentId == null || opponentId == undefined) {
      return 'error: undefined opponent';
    }
    return this.pongService.startChallenge(client, opponentId);
  }

  @SubscribeMessage('challenge-list')
  public challengeList(@ConnectedSocket() client: Socket) {
    return this.pongService.challengeList(client);
  }

  @SubscribeMessage('accept-challenge')
  public acceptChallenge(@ConnectedSocket() client: Socket, @MessageBody() opponentId: number) {
    if (opponentId == null || opponentId == undefined) {
      return;
    }
    return this.pongService.acceptChallenge(this.server, client, opponentId);
  }

  @SubscribeMessage('cancel-challenge')
  public cancelChallenge(@ConnectedSocket() client: Socket) {
    return this.pongService.cancelChallenge(client);
  }

  @SubscribeMessage('rematch')
  public handleRematch(@ConnectedSocket() client: Socket, @MessageBody() opponentId: number) {
    if (opponentId == null || opponentId == undefined) {
      return;
    }
    return this.pongService.handleRematch(this.server, client, opponentId);
  }

  @SubscribeMessage('cancel-rematch')
  public cancelRematch(@ConnectedSocket() client: Socket) {
    return this.pongService.cancelRematch(client);
  }

  // chat
  @SubscribeMessage('join-channel-room')
  public async joinChannelRoom(@ConnectedSocket() clientSocket: Socket, @MessageBody() id: number) {
    const channel = await this.chatService.joinChannelRoom(clientSocket, id);
    if (channel) {
      this.server.to(channel.room).emit('channel-join', channel.messages);
    }
  }

  @SubscribeMessage('leave-channel-room')
  public async leaveChannelRoom(@ConnectedSocket() clientSocket: Socket, @MessageBody() id: number) {
    const channel = await this.chatService.leaveChannelRoom(clientSocket, id);
    if (channel) {
      this.server.to(channel.room).emit('channel-join', channel.messages);
    }
  }

  @SubscribeMessage('send-message')
  public async handlePushMessageToChannel(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: any) {
    const channel = await this.chatService.handlePushMessageToChannel(clientSocket, data.currentChannelId, data.message);
    if (channel) {
      this.server.to(channel.room).emit('new-message', channel.messages);
    }
  }

  @SubscribeMessage('invite-user')
  public async handleInviteUser(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, inviteId: number }) {
    const channel = await this.chatService.handleInviteUser(clientSocket, data.channelId, data.inviteId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('kick-user')
  public async handleKickUser(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, kickedId: number }) {
    const channel = await this.chatService.handleKickUser(clientSocket, data.channelId, data.kickedId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('mute-user')
  public async handleMuteUser(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, mutedId: number }) {
    const channel = await this.chatService.handleMuteUser(clientSocket, data.channelId, data.mutedId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('unmute-user')
  public async handleUnmuteUser(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, mutedId: number }) {
    const channel = await this.chatService.handleUnmuteUser(clientSocket, data.channelId, data.mutedId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('ban-user')
  public async handleBanUser(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, bannedId: number }) {
    const channel = await this.chatService.handleBanUser(clientSocket, data.channelId, data.bannedId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('unban-user')
  public async handleUnbanUser(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, bannedId: number }) {
    const channel = await this.chatService.handleUnbanUser(clientSocket, data.channelId, data.bannedId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('set-admin')
  public async handleSetAdmin(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, newAdminId: number }) {
    const channel = await this.chatService.handleSetAdmin(clientSocket, data.channelId, data.newAdminId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }

  @SubscribeMessage('unset-admin')
  public async handleUnsetAdmin(@ConnectedSocket() clientSocket: Socket, @MessageBody() data: { channelId: number, unsetAdminId: number }) {
    const channel = await this.chatService.handleUnsetAdmin(clientSocket, data.channelId, data.unsetAdminId);
    if (channel) {
      this.server.to(channel.room).emit('channel-update', channel);
    }
  }
}
