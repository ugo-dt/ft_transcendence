import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, HttpModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
