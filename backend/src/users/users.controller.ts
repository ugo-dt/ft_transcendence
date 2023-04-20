import { ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { MessageBody } from '@nestjs/websockets';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get("me")
  getMyInfo(@CurrentUser() user: User): User {
    return user;
  }

  @Get(":username")
  async findUser(@Param("username") username: string) {
    return this.usersService.findOneUsername(username);
  }  
  
  @Get("get/all")
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Delete(":id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }
  
  @Get('get/rankings')
  getRankings() {
    return this.usersService.rankings();
  }
  
  @Post("edit/username")
  async editUsername(@CurrentUser() user: User, @MessageBody() data: {username: string}) {
    return await this.usersService.update(user.id, {username: data.username});
  }

  @Post("edit/avatar")
  async editAvatar(@CurrentUser() user: User, @MessageBody() data: {avatar: string}) {
    return await this.usersService.update(user.id, {avatar: data.avatar});
  }

  @Post("add-friend/")
  async addFriend(@CurrentUser() user: User, @MessageBody() data: {friendUsername: string}) {
    // return await this.usersService.addFriend(user.id, data.friendUsername);
  }

  @Delete("remove-friend/:friendUsername")
  async removeFriend(@CurrentUser() user: User, @MessageBody() data: {friendUsername: string}) {
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
