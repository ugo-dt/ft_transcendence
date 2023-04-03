import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post("/signin")
	async signIn(@Body() body: LoginUserDto) {
		const tokens = await this.authService.getUserTokens(body.code);
		const resourceOwnerId = await this.authService.getTokenInfo(tokens.accessToken);
		const user = await this.authService.signIn(tokens, resourceOwnerId);
		return user;
		// get information about tokens
		// create/update in DB
		// set cookies
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get("/:id")
	async findUser(@Param("id") id: string) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException("user not found");
		}
		return user;
	}
}
