import { Controller, Get } from '@nestjs/common';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController {
  @Get()
  getHello(): string {
    return 'This is pong!';
  }
}
