import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PongModule } from './pong/pong.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Room } from './room/entities/room.entity';
import { RoomModule } from './room/room.module';
import { Channel } from './chat/channel/entities/channel.entity';
import { Message } from './chat/message/entity/message.entity';
import { AppGateway } from './app.gateway';
import { ChannelModule } from './chat/channel/channel.module';
import { MessageModule } from './chat/message/message.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password:  'postgres',
      database: 'postgres',
      entities: [User, Room, Channel, Message],
      synchronize: true,
    }),
	PongModule,
	ChatModule,
    UsersModule,
	ChannelModule,
	MessageModule,
    RoomModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule { }
