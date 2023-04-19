import { ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Post, Query, UseInterceptors } from '@nestjs/common';
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

  @Get("all")
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get(":username")
  async findUser(@Param("username") username: string) {
    const user = await this.usersService.findOneUsername(username);
    if (!user) {
      throw new NotFoundException("user not found");
    }
    return user;
  }

  @Delete(":id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Post('edit-username')
  async changeUsername(@Query("username") username: string, @Query("newUsername") newUsername: string): Promise<User | null> {
    const user = await this.usersService.findOneUsername(username);
    if (!user) {
      throw new NotFoundException("user not found");
    };
    return this.usersService.update(user.id, {username: newUsername});
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

  @Get('rankings')
  async getRankings(): Promise<User[]> {
    const users = (await this.usersService.findAll()).slice(0, 50);
    return users.sort((a, b) => (a.rating > b.rating) ? -1 : 1);
  }

  // @Get('friends/:username')
  // async getFriends(@Param("username") username: string): Promise<User[]> {
  //   return await this.usersService.userFriendList(username);
  // }
}
