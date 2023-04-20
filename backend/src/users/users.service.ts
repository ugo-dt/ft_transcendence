import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) { }

  create(
    accessToken: string,
    refreshToken: string,
    id42: number,
    username: string,
    avatar: string,
    status: string,
    rating: number,
    backgroundColor: string,
  ): Promise<User> {
    const user = this.repo.create({ accessToken, refreshToken, id42, username, avatar, status, rating, backgroundColor });
    return this.repo.save(user);
  }

  findOneUsername(username: string): Promise<User | null> {
    /** The ILike option allows matching of strings based on comparison with a pattern.
     * The key word ILIKE can be used instead of LIKE to make the match case-insensitive
     * according to the active locale. This is not in the SQL standard but is a PostgreSQL extension. */
    return this.repo.findOneBy({ username: ILike(username) });
  }

  findOneId(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  findOneId42(id42: number): Promise<User | null> {
    return this.repo.findOneBy({ id42 });
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<User>): Promise<User> {    
    const user = await this.findOneId(id);
    if (!user) throw new NotFoundException("user not found");
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOneId(id);
    if (!user) throw new NotFoundException("user not found");
    return this.repo.remove(user);
  }
}