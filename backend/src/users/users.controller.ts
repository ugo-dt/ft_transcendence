import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post("/login")
	async login(@Body() body: LoginUserDto) {
		const tokens = await this.authService.getUserTokens(body.code);
		const info = await this.authService.getTokenInfo(tokens.access_token);
		const user = await this.authService.login(tokens, info.resource_owner_id);
		return user;
		// get information about tokens
		// create/update in DB
		// set cookies
	}
}
