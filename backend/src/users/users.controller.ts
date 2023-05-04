import { ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { MessageBody } from '@nestjs/websockets';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { EnvService } from 'src/config/env.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService, private envService: EnvService) { }

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

  // todo: add file validation
  // https://docs.nestjs.com/techniques/file-upload#basic-example
  @Post("edit/avatar")
  @UseInterceptors(FileInterceptor('image'))
  async editAvatar(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<User> {
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
    return await this.usersService.setPaddleColor(user.id, data.color);
  }

  @Post("add-friend/")
  async addFriend(@CurrentUser() user: User, @MessageBody() data: { friendId: number }) {
    return await this.usersService.addFriend(user.id, data.friendId);
  }

  @Post('disable2fa')
  disable2fa(@CurrentUser() user: User) {
    return this.usersService.setHas2fa(user.id, false);
  }

  @Delete("remove-friend/:friendId")
  async removeFriend(@CurrentUser() user: User, @Param("friendId") friendId: number) {
    return await this.usersService.removeFriend(user.id, friendId);
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
