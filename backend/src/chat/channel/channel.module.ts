import { Module } from "@nestjs/common";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { Channel } from "./entities/channel.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageModule } from "../message/message.module";

@Module({
	imports: [TypeOrmModule.forFeature([Channel]), MessageModule],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService],
  })
  export class ChannelModule {}
  