import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entity/message.entity';

@Injectable()
export class MessageService {
	private readonly logger: Logger;
	constructor(@InjectRepository(Message) private repo: Repository<Message>) {
		this.logger = new Logger("MessageService");
	}

	private _timestamp_mmddyy() {
		const currentDate = new Date();
		const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
		const day = currentDate.getDate().toString().padStart(2, '0');
		const year = currentDate.getFullYear().toString().substr(-2);
		const hours = currentDate.getHours().toString().padStart(2, '0');
		const minutes = currentDate.getMinutes().toString().padStart(2, '0');
		const seconds = currentDate.getSeconds().toString().padStart(2, '0');
		const time = `${hours}:${minutes}:${seconds}`;
		return `${month}/${day}/${year} ${time}`;
	}

	async create(content: string, senderId: number, destination: number): Promise<Message> {
		const message = this.repo.create(
			{
				content: content,
				timestamp: this._timestamp_mmddyy(),
				senderId: senderId,
				destination: destination,
			}
		);
		return await this.repo.save(message);;
	}

	public findOneId(id: number): Promise<Message | null> {
		return this.repo.findOneBy({ id });
	  }
}
