import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) {}

	create(accessToken: string, refreshToken: string, id42: number, username: string, avatar: string): Promise<User> {
		const user = this.repo.create({accessToken, refreshToken, id42, username, avatar});
		return this.repo.save(user);
	}

	findOneId(id: number): Promise<User | null> {
		return this.repo.findOneBy({id});
	}

	findOneId42(id42: number): Promise<User | null> {
		return this.repo.findOneBy({id42});
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