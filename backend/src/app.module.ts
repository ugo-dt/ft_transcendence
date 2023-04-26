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
      host: 'localhost',
      port: 5432,
      username: 'nestjs',
      password:  'nestjspassword',
      database: 'nestjs',
      entities: [User, Room],
      synchronize: true
    }),
    UsersModule,
    RoomModule,
    AuthModule,
    PongModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
