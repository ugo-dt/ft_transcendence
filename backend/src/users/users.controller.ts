import { ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor, CurrentUserInterceptor)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get("me")
	getMyInfo(@CurrentUser() user: User) {
		return user;
	}

	@Get("all")
	findAllUsers() {
		return this.usersService.findAll();
	}

	@Get(":id")
	async findUser(@Param("id") id: string) {
		const user = await this.usersService.findOneId(parseInt(id));
		if (!user) throw new NotFoundException("user not found");
		return user;
	}

	@Delete(":id")
	removeUser(@Param("id") id: string) {
		return this.usersService.remove(parseInt(id));
	}
}
