import { ForbiddenException, Injectable, Logger, MethodNotAllowedException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Channel } from "./entities/channel.entity";
import { UsersService } from "src/users/users.service";
import { Message } from "../message/entity/message.entity";

@Injectable()
export class ChannelService {
	private readonly logger: Logger;
	constructor(@InjectRepository(Channel) private repo: Repository<Channel>) {
		this.logger = new Logger("ChannelService");
	}

	async create(name: string, password: string, isDm: boolean, userId: number, usersService: UsersService): Promise<Channel> {
		const channel = this.repo.create(
			{
				name: name,
				password: password,
				isDm: isDm,
				messages: [],
				users: [userId],
				admin: [userId],
				muted: [],
				banned: [],
				room: '',
			}
		);
		const user = await usersService.findOneId(userId);
		if (!user)
			throw new NotFoundException('user not found');
		channel.room = 'channel-room-' + channel.id;
		const promise = await this.repo.save(channel);
		usersService.addChannel(user.id, channel.id);
		this.logger.log(`Saved channel ${promise.id}`);
		return promise;
	}

	async delete(channelId: number, userId: number, usersService: UsersService) {
		const channel = await this.findOneId(channelId);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		if (!channel.admin.includes(userId)) {
			throw new ForbiddenException('forbidden');
		}
		for (const user of channel.users.values()) {
			usersService.removeChannel(user, channel.id);
		}
		return this.repo.remove(channel);
	}

	findOneId(id: number): Promise<Channel | null> {
		return this.repo.findOneBy({ id });
	}

	findAll(): Promise<Channel[]> {
		return this.repo.find();
	}

	async addUser(channelId: number, userId: number, password: string) {
		const channel = await this.findOneId(channelId);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		if (channel.password.length && channel.password !== password) {
			throw new ForbiddenException('wrong password');
		}
		channel.users.push(userId);
		return this.repo.save(channel);
	}

	async removeUser(channelId: number, userId: number) {
		const channel = await this.findOneId(channelId);
		if (!channel) {
			throw new NotFoundException('channel not found');
		}
		const index = channel.users.indexOf(userId);
		if (index > -1) {
			channel.users.splice(index, 1);
		}
		return this.repo.save(channel);
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
}
