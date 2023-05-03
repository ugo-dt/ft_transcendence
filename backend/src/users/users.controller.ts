import { BadRequestException, ClassSerializerInterceptor, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { MessageBody } from '@nestjs/websockets';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { EnvService } from 'src/config/env.service';
import { ChannelService } from 'src/chat/channel/channel.service';
import { Channel } from 'src/chat/channel/entities/channel.entity';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private envService: EnvService,
    private channelService: ChannelService
  ) { }

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

  @Get('get/user-ranking/:id')
  gerUserRanking(@Param("id") id: number): Promise<number> {
    return this.usersService.userRanking(id);
  }

  @Post("edit/username")
  editUsername(@CurrentUser() user: User, @MessageBody() data: { username: string }): Promise<User> {
    return this.usersService.setUsername(user.id, data.username);
  }

  // https://docs.nestjs.com/techniques/file-upload#basic-example
  @Post("edit/avatar")
  @UseInterceptors(FileInterceptor('image'))
  async editAvatar(
    @CurrentUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }), // 2 MB
          new FileTypeValidator({
            fileType: new RegExp(/\/(jpg|jpeg|png|gif|svg)$/i),
          }),
        ],
      }),
    )
    file: Express.Multer.File
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }
    if (!file.mimetype.startsWith('image')) {
      throw new BadRequestException('invalid file type');
    }

    console.log(file.size);
    console.log(file.mimetype);
    const dirname = this.envService.get('AVATARS_DIR');
    const filename = user.id + '.' + Date.now() + '.' + file.mimetype.split("/").pop();
    const fullpath = dirname + '/' + filename;
    const writeStream = createWriteStream(fullpath);
    writeStream.write(file.buffer);
    writeStream.end();
    return this.usersService.setAvatar(user.id, `${this.envService.get('BACKEND_HOST')}/${fullpath}`);
  }

  @Delete("edit/avatar")
  async deleteAvatar(@CurrentUser() user: User): Promise<User> {
    return this.usersService.setAvatar(user.id, this.envService.get('DEFAULT_AVATAR'));
  }

  @Post("edit/paddle-color")
  async editPaddleColor(@CurrentUser() user: User, @MessageBody() data: { color: string }) {
    const __color = data.color;
    if (__color != "white" && __color != "yellow" && __color != "#fd761b" && __color != "#ff0000" && __color != "#ff14b8"
      && __color != "#9114ff" && __color != "blue" && __color != "#14ebff" && __color != "green" && __color != "#92ff0c") {
      throw new BadRequestException('invalid color');
    }
    return await this.usersService.setPaddleColor(user.id, __color);
  }

  @Post("add-friend/")
  async addFriend(@CurrentUser() user: User, @MessageBody() data: { friendId: number }) {
    return await this.usersService.addFriend(user.id, data.friendId);
  }

  @Delete("remove-friend/:friendId")
  async removeFriend(@CurrentUser() user: User, @Param("friendId") friendId: number) {
    return await this.usersService.removeFriend(user.id, friendId);
  }

  @Post("block-user/")
  async blockUser(@CurrentUser() user: User, @MessageBody() data: { id: number }) {
    return await this.usersService.blockUser(user.id, data.id);
  }

  @Delete("unblock-user/:id")
  async unblockUser(@CurrentUser() user: User, @Param("id") id: number) {
    return await this.usersService.unblockUser(user.id, id);
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

  @Post('channels/create-channel')
  async createChannel(@CurrentUser() user: User, @MessageBody() data: { name: string, password: string, isDm: boolean, isPrivate: boolean }): Promise<Channel> {
    return await this.channelService.create(data.name, data.password, data.isDm, user.id, data.isPrivate, this.usersService);
  }

  @Post('channels/join-channel/')
  async joinChannel(@CurrentUser() user: User, @MessageBody() data: { id: number, password: string }) {
    return await this.channelService.addUser(data.id, user.id, data.password, this.usersService);
  }

  @Delete('channels/leave-channel/:id')
  async leaveChannel(@CurrentUser() user: User, @Param("id") id: number) {
    return await this.channelService.removeUser(id, user.id, this.usersService);
  }

  @Get('channels/user-channels')
  async getUserChannels(@CurrentUser() user: User): Promise<Channel[]> {
    return await this.usersService.getUserChannels(user, this.channelService);
  }

  @Get('channels/channel-users/:id')
  async getChannelUsers(@CurrentUser() user: User, @Param("id") id: number): Promise<User[]> {
    return await this.channelService.getChannelUsers(id, this.usersService);
  }

  @Post('channels/edit-channel-password')
  async editChannelPassword(@CurrentUser() user: User, @MessageBody() data: { channelId: number, newPassword: string }): Promise<Channel> {
    return await this.channelService.editPassword(user.id, data.channelId, data.newPassword);
  }
}
