import { ClassSerializerInterceptor, Controller, Delete, Get, Logger, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { MessageBody } from '@nestjs/websockets';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { ChannelService } from 'src/chat/channel/channel.service';
import { Channel } from 'src/chat/channel/entities/channel.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
  private readonly logger: Logger;
  constructor(private usersService: UsersService, private channelService: ChannelService) {
    this.logger = new Logger("UsersController");
  }

  @Get("me")
  getMyInfo(@CurrentUser() user: User): User {
    return user;
  }

  @Get('id/:id')
  findUserId(@Param("id") id: number): Promise<User | null> {
    return this.usersService.findOneId(id);
  }

  @Get(":username")
  findUser(@Param("username") username: string): Promise<User | null> {
    return this.usersService.findOneUsername(username);
  }

  @Get("get/all")
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Delete(":id")
  removeUser(@Param("id") id: string): Promise<User> {
    return this.usersService.remove(parseInt(id));
  }

  @Get('get/rankings')
  getRankings(): Promise<User[]> {
    return this.usersService.rankings();
  }

  @Post("edit/username")
  editUsername(@CurrentUser() user: User, @MessageBody() data: { username: string }): Promise<User> {
    return this.usersService.setUsername(user.id, data.username);
  }

  // todo: add file validation
  // https://docs.nestjs.com/techniques/file-upload#basic-example
  @Post("edit/avatar")
  @UseInterceptors(FileInterceptor('image'))
  async editAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<User> {
    const dirname = 'public/user';
    const filename = user.id + '.' + Date.now() + '.' + file.mimetype.split("/").pop();
    const fullpath = dirname + '/' + filename;
    const writeStream = createWriteStream(fullpath);
    writeStream.write(file.buffer);
    writeStream.end();
    return this.usersService.setAvatar(user.id, `http://192.168.1.136:3000/${fullpath}`);
  }

  @Post("edit/paddle-color")
  async editPaddleColor(@CurrentUser() user: User, @MessageBody() data: { color: string }) {
    return await this.usersService.setPaddleColor(user.id, data.color);
  }

  @Post("add-friend/")
  async addFriend(@CurrentUser() user: User, @MessageBody() data: { friendUsername: string }) {
    return await this.usersService.addFriend(user.id, data.friendUsername);
  }

  @Delete("remove-friend/:friendUsername")
  async removeFriend(@CurrentUser() user: User, @Param("friendUsername") friendUsername: string) {
	return await this.usersService.removeFriend(user.id, friendUsername);
  }
	
  @Post("block-user/")
  async blockUser(@CurrentUser() user: User, @MessageBody() data: { username: string }) {
	return await this.usersService.blockUser(user.id, data.username);
  }

  @Delete("unblock-friend/:username")
  async unblockUser(@CurrentUser() user: User, @Param("username") username: string) {
    return await this.usersService.unblockUser(user.id, username);
  }

  @Get('edit/is-valid-username')
  async isValidUsername(@Query("username") username: string): Promise<string> {
    if (username.length < 3) {
      return 'too short';
    }
    if (username.length > 15) {
      return 'too long';
    }
    const user = await this.usersService.findOneUsername(username);
    if (!user) {
      return 'ok';
    }
    return 'already in use';
  }

  /*---Chat---*/

  @Post('create-channel')
	async createChannel(@CurrentUser() user: User, @MessageBody() data: { name: string, password: string, isDm: boolean}): Promise<Channel> {
		return await this.channelService.create(data.name, data.password, data.isDm, user.id, this.usersService);
	}

	@Delete('delete-channel/:id')
	async deleteChannel(@CurrentUser() user: User, @Param("id") id: number): Promise<Channel> {
		return await this.channelService.delete(id, user.id, this.usersService);
	}

	@Post('join-channel/:id')
	async joinChannel(@CurrentUser() user: User, @Param("id") id: number, @MessageBody() password: string) {
		return await this.channelService.addUser(id, user.id, password);
	}
}
