import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';

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
    avatar: string,
    status: string,
    rating: number,
    paddleColor: string,
    friends: string[],
  ): Promise<User> {
    const user = this.repo.create({ accessToken, refreshToken, id42, username, avatar, status, rating, paddleColor, friends });
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

  public findAll(): Promise<User[]> {
    return this.repo.find();
  }

  public async rankings() {
    const users = (await this.findAll()).sort((a, b) => (b.rating - a.rating));
    return users.slice(0, 50);
  }

  public async addFriend(id: number, friendName: string): Promise<User> {
    const user = await this.findOneId(id);
    const friend = await this.findOneUsername(friendName);
    if (!user || !friend) {
      throw new NotFoundException("user not found");
    }
    if (!user.friends.includes(friendName)) {
      user.friends.push(friendName);
    }
    return this.repo.save(user);
  }

  public async removeFriend(id: number, friendName: string): Promise<User> {
    const user = await this.findOneId(id);
    const friend = await this.findOneUsername(friendName);
    if (!user || !friend) {
      throw new NotFoundException("user not found");
    }
    const index = user.friends.findIndex(f => f === friendName);
    if (index === -1) {
      throw new NotFoundException("no such friend");
    }
    user.friends.splice(index, 1);
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
  public async getAvatar(id: number) { return (await this._user(id)).avatar;}
  public async getRating(id: number) { return (await this._user(id)).rating;}
  public async getPaddleColor(id: number) { return (await this._user(id)).paddleColor;}
  
  public setUsername(id: number, username: string) { return this.update(id, { username: username }); }
  public setAvatar(id: number, avatar: string) { return this.update(id, { avatar: avatar }); }
  public setOnline(id: number) { return this.update(id, { status: STATUS_ONLINE }); }
  public setInGame(id: number) { return this.update(id, { status: STATUS_IN_GAME }); }
  public setOffline(id: number) { return this.update(id, { status: STATUS_OFFLINE }); }
  public setRating(id: number, rating: number) { return this.update(id, { rating: rating }); }
  public setPaddleColor(id: number, paddleColor: string) { return this.update(id, { paddleColor: paddleColor }); }
}