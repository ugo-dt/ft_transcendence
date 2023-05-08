import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChannelService } from './channel/channel.service';
import { UsersService } from 'src/users/users.service';
import Client from 'src/Client/Client';
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

  public isChannelUser(channel: Channel, userId: number): boolean { return channel.users.includes(userId); }
  public isUserAdmin(channel: Channel, userId: number): boolean { return channel.admins.includes(userId); }
  public isUserMuted(channel: Channel, userId: number): boolean { return channel.muted.includes(userId); }
  public isUserBanned(channel: Channel, userId: number): boolean { return channel.banned.includes(userId); }

  public async handleJoinChannel(clientSocket: Socket, channelId: number, password: string): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    try {
      return await this.channelService.addUser(channelId, client.id, password, this.usersService);
    } catch (error) {
      return null;
    }
  }

  public async handleLeaveChannel(clientSocket: Socket, channelId: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    return await this.channelService.removeUser(channelId, client.id, this.usersService);
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
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id)) {
      return null;
    }
    if (!channel.users.includes(inviteId)) {
      channel.users.push(inviteId);
      await this.usersService.addChannel(inviteId, channel);
      if (!channel.admins.includes(inviteId) && channel.admins.length === 0)
        channel.admins.push(inviteId);
      if (channel.banned.includes(inviteId)) {
        const index = channel.banned.indexOf(inviteId);
        if (index > -1) {
          channel.banned.splice(index, 1);
        }
      }
      const promise = await this.channelService.update(channel.id, channel);
      const client = Client.at(inviteId);
      if (client) {
        client.addChannel(channel);
        client.emit('new-channel', channel);
      }
      return promise;
    }
    return null;
  }

  public async handleKickUser(clientSocket: Socket, channelId: number, kickedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(kickedId)) {
      return null;
    }
    if (channel.admins.indexOf(client.id) !== 0) {
      if (!channel.admins.includes(client.id) || channel.admins.includes(kickedId)) {
        return null;
      }
    }
    return await this.channelService.removeUser(channelId, kickedId, this.usersService);
  }

  public async handleMuteUser(clientSocket: Socket, channelId: number, mutedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(mutedId)) {
      return null;
    }
    if (channel.admins.indexOf(client.id) !== 0) {
      if (!channel.admins.includes(client.id) || channel.admins.includes(mutedId)) {
        return null;
      }
    }
    if (!channel.muted.includes(mutedId)) {
      channel.muted.push(mutedId);
    }
    return await this.channelService.update(channel.id, channel);
  }

  public async handleUnmuteUser(clientSocket: Socket, channelId: number, mutedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(mutedId)) {
      return null;
    }
    if (channel.admins.indexOf(client.id) !== 0) {
      if (!channel.admins.includes(client.id) || channel.admins.includes(mutedId)) {
        return null;
      }
    }
    if (channel.muted.includes(mutedId)) {
      const index = channel.muted.indexOf(mutedId);
      if (index > -1) {
        channel.muted.splice(index, 1);
      }
    }
    return await this.channelService.update(channel.id, channel);
  }

  public async handleBanUser(clientSocket: Socket, channelId: number, bannedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(bannedId)) {
      return null;
    }
    if (channel.admins.indexOf(client.id) !== 0) {
      if (!channel.admins.includes(client.id) || channel.admins.includes(bannedId)) {
        return null;
      }
    }
    await this.channelService.removeUser(channelId, bannedId, this.usersService);
    return await this.channelService.banUser(channelId, bannedId);
  }

  public async handleUnbanUser(clientSocket: Socket, channelId: number, bannedId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(bannedId)) {
      return null;
    }
    if (channel.admins.indexOf(client.id) !== 0) {
      if (!channel.admins.includes(client.id) || channel.admins.includes(bannedId)) {
        return null;
      }
    }
    return await this.channelService.update(channel.id, channel);
  }

  public async handleSetAdmin(clientSocket: Socket, channelId: number, newAdminId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(newAdminId)) {
      return null;
    }
    if (channel.admins.indexOf(client.id) !== 0) {
      if (!channel.admins.includes(client.id)) {
        return null;
      }
    }
    if (!channel.admins.includes(newAdminId)) {
      channel.admins.push(newAdminId);
    }
    return await this.channelService.update(channel.id, channel);
  }

  public async handleUnsetAdmin(clientSocket: Socket, channelId: number, unsetAdminId: number): Promise<Channel | null> {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(client.id) || !channel.users.includes(unsetAdminId)) {
      return null;
    }

    // is owner?
    if (channel.admins.indexOf(client.id) !== 0) {
      return null;
    }
    if (channel.admins.includes(unsetAdminId)) {
      const index = channel.admins.indexOf(unsetAdminId);
      if (index > -1) {
        channel.admins.splice(index, 1);
      }
    }
    return await this.channelService.update(channel.id, channel);
  }

  public async joinChannelRoom(clientSocket: Socket, id: number) {
    const client = Client.at(clientSocket);
    if (!client) {
      return null;
    }
    const channel = await this.channelService.findOneId(id);
    if (!channel) {
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
