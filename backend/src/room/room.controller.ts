import { Controller, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('room')
export class RoomController {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger("RoomController");
  }
  
}
