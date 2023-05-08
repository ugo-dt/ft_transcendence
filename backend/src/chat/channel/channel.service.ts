import { Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { UsersService } from "src/users/users.service";
import { Message } from "../message/entity/message.entity";
import { User } from "src/users/entities/user.entity";
import * as crypto from 'crypto';
import { MessageService } from "../message/message.service";
import Client from "src/Client/Client";

@Injectable()
export class ChannelService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(Channel) private repo: Repository<Channel>,
    private readonly messageService: MessageService,
  ) {
    this.logger = new Logger("ChannelService");
  }

  async create(name: string, password: string, userId: number, isPrivate: boolean, usersService: UsersService): Promise<Channel> {
    const pwd = crypto.createHash('sha256').update(password).digest('hex');
    const channel = this.repo.create(
      {
        name: name,
        password: password === "" ? "" : pwd,
        messages: [],
        users: [userId],
        admins: [userId],
        muted: [],
        banned: [],
        room: '',
        isPrivate: isPrivate,
      }
    );
    const promise = await this.repo.save(channel);
    await this.update(channel.id, {room: 'channel-room-' + channel.id});
    await usersService.addChannel(userId, channel);
    return promise;
  }

  findOneId(id: number): Promise<Channel | null> {
    return this.repo.findOneBy({ id });
  }

  findAll(): Promise<Channel[]> {
    return this.repo.find();
  }

  async addUser(channelId: number, userId: number, password: string, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (channel.isPrivate) {
      return null;
    }
    if (channel.banned.includes(userId)) {
      return null;
    }
    if (!channel.users.includes(userId)) {
      if (channel.password.length && crypto.createHash('sha256').update(password).digest('hex') !== channel.password) {
        return null;
      }
      channel.users.push(userId);
      await usersService.addChannel(userId, channel);
      if (!channel.admins.includes(userId) && channel.admins.length === 0)
        channel.admins.push(userId);
    }
    const promise = await this.repo.save(channel);
    const client = Client.at(userId);
    if (client) {
      client.addChannel(channel);
      client.emit('new-channel', channel);
    }
    return promise;
  }

  async removeUser(channelId: number, userId: number, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    const index = channel.users.indexOf(userId);
    if (index > -1) {
      channel.users.splice(index, 1);
      const adminIndex = channel.admins.indexOf(userId);
      if (index > -1) {
        channel.admins.splice(adminIndex, 1);
      }
      await usersService.removeChannel(userId, channel);
      if (channel.users.length === 0) {
        return await this.remove(channel.id);
      }
      if (channel.admins.length === 0) {
        channel.admins.push(channel.users[0]);
      }
    }
    return await this.repo.save(channel);
  }

  public async newMessage(channelId: number, clientId: number, content: string): Promise<Channel | null> {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (channel.banned.includes(clientId) || channel.muted.includes(clientId)) {
      return null;
    }
    const message = await this.messageService.create(content, clientId, channelId);
    channel.messages.push(message.id);
    return await this.repo.save(channel);
  }

  public async deleteMessage(id: number, message: Message): Promise<Channel | null> {
    const channel = await this.findOneId(id);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    const index = channel.messages.indexOf(message.id);
    if (index > -1) {
      channel.messages.splice(index, 1);
    }
    return await this.repo.save(channel);
  }

  public async getChannelUsers(id: number, usersService: UsersService): Promise<User[]> {
    const channel = await this.findOneId(id);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    const users: User[] = [];
    for (const userId of channel.users) {
      const user = await usersService.findOneId(userId);
      if (user) {
        users.push(user);
      }
    }
    return users;
  }

  public async editPassword(userId: number, channelId: number, newPassword: string): Promise<Channel> {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    if (channel.admins.indexOf(userId) != 0) {
      throw new UnauthorizedException('only the channel owner can set edit the password');
    }
    if (newPassword.length) {
      channel.password = crypto.createHash('sha256').update(newPassword).digest('hex');
    }
    else {
      channel.password = '';
    }
    return await this.repo.save(channel);
  }

  public async update(id: number, attrs: Partial<Channel>): Promise<Channel> {
    const channel = await this.findOneId(id);
    if (!channel) {
      throw new NotFoundException("channel not found");
    }
    Object.assign(channel, attrs);
    return this.repo.save(channel);
  }

  public async remove(id: number): Promise<Channel> {
    const channel = await this.findOneId(id);
    if (!channel) {
      throw new NotFoundException("channel not found");
    }
    for (const msg of channel.messages.values()) {
      this.messageService.remove(msg);
    }
    return this.repo.remove(channel);
  }

  public async isUserAdmin(channelId: number, userId: number): Promise<boolean> {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException("channel not found");
    }
    return channel.admins.includes(userId);
  }

  public async isUserBanned(channelId: number, userId: number): Promise<boolean> {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException("channel not found");
    }
    return channel.banned.includes(userId);
  }

  public async isUserMuted(channelId: number, userId: number): Promise<boolean> {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException("channel not found");
    }
    return channel.muted.includes(userId);
  }

  public async banUser(channelId: number, userId: number) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException("channel not found");
    }
    if (!channel.banned.includes(userId)) {
      channel.banned.push(userId);
    }
    return await this.repo.save(channel);
  }
}
