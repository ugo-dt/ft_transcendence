import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { EnvService } from './config/env.service';
import { EnvModule } from './config/env.module';

@Module({
  imports: [
    EnvModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.get('POSTGRES_HOST'),
        port: envService.get('POSTGRES_PORT'),
        username: envService.get('POSTGRES_USER'),
        password: envService.get('POSTGRES_PASSWORD'),
        database: envService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        entities: [User, Room, Channel, Message],
        synchronize: envService.get('SYNCHRONIZE'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        index: false
      },
    }),
    PongModule,
    ChatModule,
    UsersModule,
    ChannelModule,
    MessageModule,
    RoomModule,
    AuthModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule { }
