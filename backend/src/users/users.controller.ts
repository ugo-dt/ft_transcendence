import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post("/login")
	async login(@Body() body: LoginUserDto) {
		return this.authService.getUserTokens(body.code);
	}
}
