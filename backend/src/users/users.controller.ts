import { ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get("/me")
	getMyInfo() {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get("/all")
	findAllUsers() {
		return this.usersService.findAll();
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get("/:id")
	async findUser(@Param("id") id: string) {
		const user = await this.usersService.findOneId(parseInt(id));
		if (!user) throw new NotFoundException("user not found");
		return user;
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Delete("/:id")
	removeUser(@Param("id") id: string) {
		return this.usersService.remove(parseInt(id));
	}
}
