import { ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get("me")
  getMyInfo(@CurrentUser() user: User) {
    return user;
  }

  
  @Get(":username")
  async findUser(@Param("username") username: string) {
    return this.usersService.findOneUsername(username);
  }
  
  @Get("all")
  findAllUsers() {
    return this.usersService.findAll();
  }
  
  @Delete(":id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }
  
  @Post("edit/username/:value")
  async editUsername(@CurrentUser() user: User, @Param("value") value: string) {
    return await this.usersService.update(user.id, {username: value});
  }

  @Post("edit/avatar/:value")
  async editAvatar(@CurrentUser() user: User, @Param("value") value: string) {
    return await this.usersService.update(user.id, {avatar: value});
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
