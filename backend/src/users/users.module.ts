import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { EnvService } from 'src/config/env.service';
import { ChannelModule } from 'src/chat/channel/channel.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ChannelModule],
  controllers: [UsersController],
  providers: [UsersService, CurrentUserInterceptor, EnvService],
  exports: [UsersService],
})
export class UsersModule {}
