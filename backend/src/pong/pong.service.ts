import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {
  getHello(): string {
    return 'This is pong!';
  }
}
