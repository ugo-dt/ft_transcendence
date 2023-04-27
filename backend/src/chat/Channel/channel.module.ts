import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { Channel } from "./entities/channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { UsersModule } from "src/users/users.module";

@Module({
	imports: [TypeOrmModule.forFeature([Channel])],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService, ChannelModule],
  })
  export class ChannelModule {}
  