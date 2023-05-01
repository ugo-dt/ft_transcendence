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
    const options = {
      timeZone: 'Europe/Paris',
      year: '2-digit' as const,
      month: '2-digit' as const,
      day: '2-digit' as const,
      hour: 'numeric' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const
    };
    const cestDate = currentDate.toLocaleString('en-US', options);
    return cestDate;
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
