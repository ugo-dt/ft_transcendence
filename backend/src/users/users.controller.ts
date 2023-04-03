import { Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';
import { UsersGuard } from "./guards/users.guard";

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post("/signin")
	async signIn(@Body() body: LoginUserDto, @Res({passthrough: true}) response: Response) {
		const tokens = await this.authService.getUserTokens(body.code);
		const resourceOwnerId = await this.authService.getTokenInfo(tokens.accessToken);
		const user = await this.authService.signIn(tokens, resourceOwnerId);
		response.cookie("id42", user.id42);
		return user;
	}

	@Post("/signout")
	@UseGuards(UsersGuard)
	signout(@Res({passthrough: true}) response: Response) {
		response.clearCookie("id42");
	}

	@Get("/myid")
	logId(@Req() request: Request) {
		return request.cookies;
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
