import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { EnvService } from 'src/config/env.service';

@Module({
  imports: [UsersModule, HttpModule],
  providers: [AuthService, EnvService],
  controllers: [AuthController]
})
export class AuthModule {}
