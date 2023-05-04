import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import Client from 'src/Client/Client';
import { ChannelService } from 'src/chat/channel/channel.service';
import { Channel } from 'src/chat/channel/entities/channel.entity';

const STATUS_ONLINE = 'online';
const STATUS_IN_GAME = 'in game';
const STATUS_OFFLINE = 'offline';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  public create(
    accessToken: string,
    refreshToken: string,
    id42: number,
    username: string,
    has2fa: boolean,
    phoneNumber: string,
    avatar: string,
    status: string,
    rating: number,
    paddleColor: string,
  ): Promise<User> {
    const user = this.repo.create({
      accessToken: accessToken,
      refreshToken: refreshToken,
      id42: id42,
      has2fa: has2fa,
      phoneNumber: phoneNumber,
      username: username,
      avatar: avatar,
      status: status,
      rating: rating,
      paddleColor,
      friends: [],
      blocked: [],
      userChannels: [],
    });
    return this.repo.save(user);
  }

  private async _user(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return (user);
  }

  public findOneUsername(username: string): Promise<User | null> {
    /** The ILike option allows matching of strings based on comparison with a pattern.
     * The key word ILIKE can be used instead of LIKE to make the match case-insensitive
     * according to the active locale. This is not in the SQL standard but is a PostgreSQL extension. */
    return this.repo.findOneBy({ username: ILike(username) });
  }

  public findOneId(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  public findOneId42(id42: number): Promise<User | null> {
    return this.repo.findOneBy({ id42 });
  }

  public findOnePhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.repo.findOneBy({phoneNumber});
  }

  public findAll(): Promise<User[]> {
    return this.repo.find();
  }

  public async rankings() {
    const users = (await this.findAll()).sort((a, b) => (b.rating - a.rating));
    return users.slice(0, 50);
  }

  public async userRanking(userId: number) {
    const rankings = (await this.findAll()).sort((a, b) => (b.rating - a.rating));
    const index = rankings.findIndex(user => user.id === Number(userId));
    if (index === -1) {
      throw new NotFoundException("user not found");
    }
    return index + 1;
  }

  public async addFriend(id: number, friendId: number): Promise<User> {
    const user = await this.findOneId(id);
    const friend = await this.findOneId(friendId);
    if (!user || !friend) {
      throw new NotFoundException("user not found");
    }
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
    }
    return this.repo.save(user);
  }

  public async removeFriend(id: number, friendId: number): Promise<User> {
    const user = await this.findOneId(id);
    const friend = await this.findOneId(friendId);
    if (!user || !friend) {
      throw new NotFoundException("user not found");
    }
    const index = user.friends.findIndex(f => f === friend.id);
    if (index > -1) {
      user.friends.splice(index, 1);
    }
    return this.repo.save(user);
  }

  public async blockUser(id: number, blockedId: number): Promise<User> {
    const user = await this.findOneId(id);
    const userToBlock = await this.findOneId(blockedId);
    if (!user || !userToBlock) {
      throw new NotFoundException("user not found");
    }
    if (!user.blocked.includes(blockedId)) {
      user.blocked.push(blockedId);
    }
    return this.repo.save(user);
  }

  public async unblockUser(id: number, blockedId: number): Promise<User> {
    const user = await this.findOneId(id);
    const userToUnblock = await this.findOneId(blockedId);
    if (!user || !userToUnblock) {
      throw new NotFoundException("user not found");
    }
    const index = user.blocked.findIndex(f => f === Number(blockedId));
    if (index > -1) {
      user.blocked.splice(index, 1);
    }
    return this.repo.save(user);
  }

  public async addChannel(userId: number, channelId: number) {
    const user = await this.findOneId(userId);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    if (!user.userChannels.includes(channelId)) {
      user.userChannels.push(channelId);
    }
    const client = Client.at(userId);
    if (client) {
      client.addChannel(channelId);
    }
    return this.repo.save(user);
  }

  public async removeChannel(userId: number, channel: Channel) {
    const user = await this.findOneId(userId);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    const index = user.userChannels.findIndex(c => c === channel.id);
    if (index === -1) {
      throw new NotFoundException("channel not found");
    }
    user.userChannels.splice(index, 1);
    const client = Client.at(userId);
    if (client) {
      client.leaveChannelRoom(channel);
      client.removeChannel(channel.id);
    }
    return this.repo.save(user);
  }

  public async update(id: number, attrs: Partial<User>): Promise<User> {
    const user = await this.findOneId(id);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  public async remove(id: number): Promise<User> {
    const user = await this.findOneId(id);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return this.repo.remove(user);
  }

  private async _isStatus(id: number, status: typeof STATUS_ONLINE | typeof STATUS_IN_GAME | typeof STATUS_OFFLINE): Promise<boolean> {
    const user = await this.findOneId(id);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return (user.status === status);
  }

  public isOnline(id: number): Promise<boolean> { return this._isStatus(id, STATUS_ONLINE); }
  public isInGame(id: number): Promise<boolean> { return this._isStatus(id, STATUS_IN_GAME); }
  public isOffline(id: number): Promise<boolean> { return this._isStatus(id, STATUS_OFFLINE); }

  public async getUsername(id: number) { return (await this._user(id)).username; }
  public async getHas2fa(id: number) { return (await this._user(id)).has2fa; }
  public async getAvatar(id: number) { return (await this._user(id)).avatar; }
  public async getRating(id: number) { return (await this._user(id)).rating; }
  public async getPaddleColor(id: number) { return (await this._user(id)).paddleColor; }
  public async getUserChannels(user: User, channelService: ChannelService) {
    const channels: Channel[] = [];
    for (const id of user.userChannels.values()) {
      const channel = await channelService.findOneId(id);
      if (channel) {
        channels.push(channel);
      }
    }
    return channels;
  }

  public async setUsername(id: number, username: string) { return this.update(id, { username: username }); }
  public async setHas2fa(id: number, has2fa: boolean) { return this.update(id, {has2fa}); }
  public async setAvatar(id: number, avatar: string) { return this.update(id, { avatar: avatar }); }
  public async setOnline(id: number) { return this.update(id, { status: STATUS_ONLINE }); }
  public async setInGame(id: number) { return this.update(id, { status: STATUS_IN_GAME }); }
  public async setOffline(id: number) { return this.update(id, { status: STATUS_OFFLINE }); }
  public async setRating(id: number, rating: number) { return this.update(id, { rating: rating }); }
  public async setPaddleColor(id: number, paddleColor: string) {
    return this.update(id, { paddleColor: paddleColor });
  }
}