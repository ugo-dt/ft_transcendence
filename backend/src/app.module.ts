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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [User],
      synchronize: true // remove for production
    }),
    UsersModule,
    AuthModule,
    PongModule,
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
