import { Controller, Head } from '@nestjs/common';

@Controller('app')
export class AppController {
  @Head('is-available')
  isAvailable() {
    return true;
  }
}
