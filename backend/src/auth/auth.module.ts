import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  exports: [AuthService],
  providers: [AuthService]
})
export class AuthModule {}
