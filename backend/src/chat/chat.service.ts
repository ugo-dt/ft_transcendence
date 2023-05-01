import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChannelService } from './channel/channel.service';
import { UsersService } from 'src/users/users.service';
import Client from 'src/Client/Client';
import { MessageService } from './message/message.service';
import { Channel } from './channel/entities/channel.entity';

@Injectable()
export class ChatService {
  private readonly logger: Logger;
  constructor(
    private readonly channelService: ChannelService,
    private readonly usersService: UsersService,
  ) {
    this.logger = new Logger("ChatService");
  }

  public async handlePushMessageToChannel(clientSocket: Socket, channelId: number, content: string): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.newMessage(channelId, client.id, content);
  }

  public async handleInviteUser(clientSocket: Socket, channelId: number, inviteId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.inviteUser(channelId, client.id, inviteId, this.usersService);
  }

  public async handleKickUser(clientSocket: Socket, channelId: number, kickedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.kickUser(channelId, client.id, kickedId, this.usersService);
  }

  public async handleMuteUser(clientSocket: Socket, channelId: number, mutedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.muteUser(channelId, client.id, mutedId);
  }

  public async handleUnmuteUser(clientSocket: Socket, channelId: number, mutedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.unmuteUser(channelId, client.id, mutedId);
  }

  public async handleBanUser(clientSocket: Socket, channelId: number, bannedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.banUser(channelId, client.id, bannedId, this.usersService);
  }

  public async handleUnbanUser(clientSocket: Socket, channelId: number, bannedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.unbanUser(channelId, client.id, bannedId);
  }

  public async handleSetAdmin(clientSocket: Socket, channelId: number, newAdminId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.setAdmin(channelId, client.id, newAdminId);
  }

  public async handleUnsetAdmin(clientSocket: Socket, channelId: number, unsetAdminId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.unsetAdmin(channelId, client.id, unsetAdminId);
  }

  //public async handleSendMessage(userSocket: Socket, data: any, server: Server): Promise<Message | null> {
  //	const channel = await this.channelService.findOneId(data.destination);
  //	if (!channel) {
  //		throw new NotFoundException('channel not found');
  //	}
  //	const client = Client.at(userSocket);
  //	if (!client) {
  //		throw new NotFoundException('user not found');
  //	}
  //	const message = await this.messageService.create(data.content, this._timestamp_mmddyy(), client.id, data.destination);
  //	this.channelService.newMessage(channel.id, message);
  //	server.to(channel.room).emit('update');
  //	return message;
  //}

  //public handleInviteUser(userSocket: Socket, data: any, server: Server) {
  //	const channel: Channel | null = Channel.at(data.currentChannelId);
  //	const user: User | null = User.at(data.ChanneSettingslInputValue);
  //	if (!user)
  //		return { data: null };
  //	if (channel) {
  //		channel.addUser(user);
  //		"Channel.list(): ", Channel.list());
  //		server.emit('update');
  //	}
  //	return (user?.IUser());
  //}

  //public handleKickUser(userSocket: Socket, data: any, server: Server) {
  //	const channel: Channel | null = Channel.at(data.currentChannelId);
  //	const user: User | null = User.at(data.ChanneSettingslInputValue);
  //	if (!user)
  //		return { data: null };
  //	if (channel) {
  //		channel.removeUser(user);
  //		"Channel.list(): ", Channel.list());
  //		server.emit('update');
  //	}
  //	return (user?.IUser());
  //}

  //public async handleLeaveChannel(userSocket: Socket, id: number, server: Server) {
  //	const channel = await this.channelService.findOneId(id);
  //	if (!channel) {
  //		throw new NotFoundException('channel not found');
  //	}
  //	const client = Client.at(userSocket);
  //	if (!client) {
  //		throw new NotFoundException('user not found');
  //	}
  //	this.channelService.removeUser(channel.id, client.id);
  //	server.to(channel.room).emit('update');
  //	return channel;
  //}

  //public async handleJoinChannel(userSocket: Socket, id: number, password: string, server: Server) {
  //	const channel = await this.channelService.findOneId(id);
  //	if (!channel) {
  //		throw new NotFoundException('channel not found');
  //	}
  //	const client = Client.at(userSocket);
  //	if (!client) {
  //		throw new NotFoundException('user not found');
  //	}
  //	this.channelService.addUser(channel.id, client.id, password);
  //	server.to(channel.room).emit('update');
  //	return channel;

  //if (channel.password !== undefined && channel.password !== crypto.createHash('sha256').update(data.channelPasswordInputValue).digest('hex')) {
  //	return { data: null };
  //}
  //channel.addUser(user);
  //"Channel.list(): ", Channel.list());
  //server.emit('update');
  //return channel?.IChannel();
  //}

  public async joinChannelRoom(clientSocket: Socket, id: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(id);
    if (!channel) {
      return null;
    }
    if (channel.banned.includes(client.id)) {
      return null;
    }
    clientSocket.join(channel.room);
    return channel;
  }

  public async leaveChannelRoom(clientSocket: Socket, id: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(id);
    if (!channel) {
      return null;
    }
    clientSocket.leave(channel.room);
    return channel;
  }
}
