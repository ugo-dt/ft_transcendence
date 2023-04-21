import { ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { MessageBody } from '@nestjs/websockets';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get("me")
  getMyInfo(@CurrentUser() user: User): User {
    return user;
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
  async getRankings(): Promise<User[]> {
    return await this.usersService.rankings();
  }

  @Post("edit/username")
  async editUsername(@CurrentUser() user: User, @MessageBody() data: { username: string }): Promise<User> {
    return await this.usersService.update(user.id, { username: data.username });
  }

  // todo: add file validation
  // https://docs.nestjs.com/techniques/file-upload#basic-example
  @Post("edit/avatar")
  @UseInterceptors(FileInterceptor('image'))
  async editAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<User> {
    const dirname = 'public/user';
    const filename = user.id + '.' + Date.now() + '.' + file.mimetype.split("/").pop();
    const fullpath = dirname + filename;
    const writeStream = createWriteStream(fullpath);
    writeStream.write(file.buffer);
    writeStream.end();
    return await this.usersService.update(user.id, {avatar: `http://192.168.1.178:3000/${fullpath}`});
  }

  // todo: add friends
  @Post("add-friend/")
  async addFriend(@CurrentUser() user: User, @MessageBody() data: { friendUsername: string }) {
    // return await this.usersService.addFriend(user.id, data.friendUsername);
  }

  @Delete("remove-friend/:friendUsername")
  async removeFriend(@CurrentUser() user: User, @MessageBody() data: { friendUsername: string }) {
    // return await this.usersService.removeFriend(user.id, data.friendUsername);
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
}
