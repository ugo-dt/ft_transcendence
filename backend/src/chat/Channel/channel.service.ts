import { ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
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

  async create(name: string, password: string, isDm: boolean, userId: number, isPrivate: boolean, usersService: UsersService): Promise<Channel> {
    const pwd = crypto.createHash('sha256').update(password).digest('hex');
    const channel = this.repo.create(
      {
        name: name,
        password: password === "" ? "" : pwd,
        isDm: isDm,
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
    channel.room = 'channel-room-' + channel.id;
    await usersService.addChannel(userId, channel.id);
    this.logger.log(`Saved channel ${promise.id}`);
    return promise;
  }

  async delete(channelId: number, userId: number, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    if (!channel.admins.includes(userId)) {
      throw new ForbiddenException('forbidden');
    }
    for (const user of channel.users.values()) {
      await usersService.removeChannel(user, channel.id, channel.room);
    }
    return this.repo.remove(channel);
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
      throw new NotFoundException('channel not found');
    }
    if (channel.banned.includes(userId)) {
      throw new ForbiddenException('user is banned');
    }
    if (!channel.users.includes(userId)) {
      if (channel.password.length && crypto.createHash('sha256').update(password).digest('hex') !== channel.password) {
        throw new UnauthorizedException('wrong password');
      }
      channel.users.push(userId);
      await usersService.addChannel(userId, channel.id);
      if (!channel.admins.includes(userId) && channel.admins.length === 0)
        channel.admins.push(userId);
    }
    return await this.repo.save(channel);
  }

  async removeUser(channelId: number, userId: number, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    const index = channel.users.indexOf(userId);
    if (index > -1) {
      channel.users.splice(index, 1);
      if (channel.admins.includes(userId)) {
        channel.admins.splice(index, 1);
        if (channel.admins.length === 0 && channel.users.length > 0) {
          const newAdmin = channel.users[0];
          if (newAdmin) {
            channel.admins.push(newAdmin);
          }
        }
      }
      await usersService.removeChannel(userId, channel.id, channel.room);
    }
    return await this.repo.save(channel);
  }

  public async newMessage(channelId: number, clientId: number, content: string) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    const message = await this.messageService.create(content, clientId, channelId);
    channel.messages.push(message.id);
    return await this.repo.save(channel);
  }

  public async deleteMessage(id: number, message: Message) {
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

  public async getChannelUsers(id: number, usersService: UsersService) {
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

  public async editPassword(userId: number, channelId: number, newPassword: string) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    if (!channel.admins.includes(userId)) {
      throw new ForbiddenException('not an admin');
    }
    if (newPassword.length) {
      channel.password = crypto.createHash('sha256').update(newPassword).digest('hex');
    }
    else {
      channel.password = '';
    }
    return await this.repo.save(channel);
  }

  public async inviteUser(channelId: number, adminId: number, inviteId: number, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId)) {
      return null;
    }
    if (!channel.users.includes(inviteId)) {
      channel.users.push(inviteId);
      await usersService.addChannel(inviteId, channel.id);
      if (!channel.admins.includes(inviteId) && channel.admins.length === 0)
        channel.admins.push(inviteId);
    }
    return await this.repo.save(channel);
  }

  public async kickUser(channelId: number, adminId: number, kickedId: number, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(kickedId)) {
      return null;
    }
    if (!channel.admins.includes(adminId) || channel.admins.includes(kickedId)) {
      return null;
    }
    this.removeUser(channelId, kickedId, usersService);
    return await this.repo.save(channel);
  }

  public async muteUser(channelId: number, adminId: number, mutedId: number) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(mutedId)) {
      return null;
    }
    if (!channel.admins.includes(adminId) || channel.admins.includes(mutedId)) {
      return null;
    }
    if (!channel.muted.includes(mutedId)) {
      channel.muted.push(mutedId);
    }
    return await this.repo.save(channel);
  }

  public async unmuteUser(channelId: number, adminId: number, mutedId: number) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(mutedId)) {
      return null;
    }
    if (!channel.admins.includes(adminId) || channel.admins.includes(mutedId)) {
      return null;
    }
    if (channel.muted.includes(mutedId)) {
      const index = channel.muted.indexOf(mutedId);
      if (index > -1) {
        channel.muted.splice(index, 1);
      }
    }
    return await this.repo.save(channel);
  }

  public async banUser(channelId: number, adminId: number, bannedId: number, usersService: UsersService) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(bannedId)) {
      return null;
    }
    if (!channel.admins.includes(adminId) || channel.admins.includes(bannedId)) {
      return null;
    }
    if (!channel.banned.includes(bannedId)) {
      this.removeUser(channelId, bannedId, usersService);
      channel.banned.push(bannedId);
    }
    return await this.repo.save(channel);
  }

  public async unbanUser(channelId: number, adminId: number, bannedId: number) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(bannedId)) {
      return null;
    }
    if (!channel.admins.includes(adminId) || channel.admins.includes(bannedId)) {
      return null;
    }
    if (channel.banned.includes(bannedId)) {
      const index = channel.banned.indexOf(bannedId);
      if (index > -1) {
        channel.banned.splice(index, 1);
      }
    }
    return await this.repo.save(channel);
  }
  
  public async setAdmin(channelId: number, adminId: number, newAdminId: number) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(newAdminId)) {
      return null;
    }
    if (!channel.admins.includes(adminId)) {
      return null;
    }
    if (!channel.admins.includes(newAdminId)) {
      channel.admins.push(newAdminId);
    }
    return await this.repo.save(channel);
  }

  public async unsetAdmin(channelId: number, adminId: number, unsetAdminId: number) {
    const channel = await this.findOneId(channelId);
    if (!channel) {
      return null;
    }
    if (!channel.users.includes(adminId) || !channel.users.includes(unsetAdminId)) {
      return null;
    }
    if (!channel.admins.includes(adminId)) {
      return null;
    }
    
    // owner?
    if (channel.admins.indexOf(adminId) !== 0) { 
      return null;
    }
    if (channel.admins.includes(unsetAdminId)) {
      const index = channel.admins.indexOf(unsetAdminId);
      if (index > -1) {
        channel.admins.splice(index, 1);
      }
    }
    return await this.repo.save(channel);
  }
}
