import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { UsersService } from "src/users/users.service";
import { Message } from "../message/entity/message.entity";
import { User } from "src/users/entities/user.entity";
import * as crypto from 'crypto';

@Injectable()
export class ChannelService {
	private readonly logger: Logger;
	constructor(@InjectRepository(Channel) private repo: Repository<Channel>) {
		this.logger = new Logger("ChannelService");
	}

	async create(name: string, password: string, isDm: boolean, userId: number, usersService: UsersService): Promise<Channel> {
		const pwd = crypto.createHash('sha256').update(password).digest('hex');
		console.log("pwd: ", pwd);
		const channel = this.repo.create(
			{
				name: name,
				password: pwd,
				isDm: isDm,
				messages: [],
				users: [userId],
				admins: [userId],
				muted: [],
				banned: [],
				room: '',
			}
		);
		console.log("channel.passwordfsdqfsd: ", channel.password);
		channel.room = 'channel-room-' + channel.id;
		const promise = await this.repo.save(channel);
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
			await usersService.removeChannel(user, channel.id);
		}
		return this.repo.remove(channel);
	}

	findOneId(id: number): Promise<Channel | null> {
		return this.repo.findOneBy({ id });
	}

	findAll(): Promise<Channel[]> {
		return this.repo.find();
	}

	async addUser(channelId: number, userId: number, usersService: UsersService) {
		const channel = await this.findOneId(channelId);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		if (!channel.users.includes(userId))
		{
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
		}
		await usersService.removeChannel(userId, channel.id);
		return await this.repo.save(channel);
	}

	async newMessage(id: number, message: Message) {
		const channel = await this.findOneId(id);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		channel.messages.push(message.id);
		return this.repo.save(channel);
	}

	async deleteMessage(id: number, message: Message) {
		const channel = await this.findOneId(id);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		const index = channel.messages.indexOf(message.id);
		if (index > -1) {
			channel.messages.splice(index, 1);
		}
		return this.repo.save(channel);
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
		if (newPassword === undefined)
			throw new NotFoundException('newPassword undefined');
		const channel = await this.findOneId(channelId);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		if (!channel.admins.includes(userId)) {
			throw new ForbiddenException('forbidden');
		}
		channel.password = crypto.createHash('sha256').update(newPassword).digest('hex');
		return this.repo.save(channel);
	}

	public async checkPassword(id: number, password: string): Promise<boolean> {
		const channel = await this.findOneId(id);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		return (crypto.createHash('sha256').update(password).digest('hex') === channel.password);
	}
}
