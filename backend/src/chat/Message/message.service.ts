import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entity/message.entity';

@Injectable()
export class MessageService {
	private readonly logger: Logger;
	constructor(@InjectRepository(Message) private repo: Repository<Message>) {
		this.logger = new Logger("ChannelService");
	  }

	async create(content: string, timestamp: string, sender: number, destination: number): Promise<Message> {
		const message = this.repo.create(
		  {
			content: content,
			timestamp: timestamp,
			sender: sender,
			destination: destination,
		  }
		);
		const promise = await this.repo.save(message);
		this.logger.log(`Saved channel ${promise.id}`);
		return promise;
	  }
}
