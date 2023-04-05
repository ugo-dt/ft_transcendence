import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';
import { UsersGuard } from "./guards/users.guard";

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post("/signin")
	async signIn(@Body() body: LoginUserDto, @Session() session: any) {
		const tokens = await this.authService.getUserTokens(body.code);
		const resourceOwnerId = await this.authService.getTokenInfo(tokens.accessToken);
		const user = await this.authService.signIn(tokens, resourceOwnerId);
		session.userId = user.id;
		return user;
	}

	@Post("/signout")
	@UseGuards(UsersGuard)
	signout(@Session() session: any) {
		session.userId = null;
	}

	@Get("/myid")
	logId(@Session() session: any) {
		return session.userId;
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
