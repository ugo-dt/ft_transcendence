import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import Elo from 'src/pong/Matchmaking/Elo';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("signin")
	async signIn(@Body() body: LoginAuthDto, @Session() session: any) {
		const tokens = await this.authService.getResourceOwnerAccessToken(body.code);
		const info = await this.authService.getResourceOwnerInfo(tokens);
		const user = await this.authService.signIn(
      tokens.access_token,
      tokens.refresh_token,
      info.resource_owner_id,
      "User",
      "http://localhost:3000/public/images/noavatar.png",
      'online',
      Elo.defaultRating,
      'black');
		session.userId = user.id;
		return user;
	}

	@Post("signout")
	@UseGuards(AuthGuard)
	signout(@Session() session: any) {
		session.userId = null;
	}

	@Post("refresh")
	@UseGuards(AuthGuard)
	refreshToken(@Session() session: any) {
		return this.authService.refreshToken(parseInt(session.userId));
	}
}
