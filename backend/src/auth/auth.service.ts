import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import * as bcrypt from "bcrypt";
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private httpService: HttpService) {}

	async getResourceOwnerAccessToken(authCode: string) {
		const options = {
			grant_type: "authorization_code",
			client_id: "u-s4t2ud-323464d0d3ecfc69260024761223d14b72b291dda193e39d980e413305d530d4",
			client_secret: "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",
			code: authCode,
			redirect_uri: "http://localhost:5173/auth"
		};
		const {data} = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options).pipe(catchError(() => {
			throw new ForbiddenException("invalid authorization code");
		})));
		return data;
	}

	async getResourceOwnerInfo(tokens: any) {
		const {data} = await firstValueFrom(this.httpService.get("https://api.intra.42.fr/oauth/token/info", {
			params: {
				access_token: tokens.access_token
			}
		}).pipe(catchError(() => {
			throw new UnauthorizedException("invalid access token");
		})));
		return data;
	}

	async signIn(acToken: string, rfToken: string, id42: number, username: string, avatar: string) {
		let user = await this.usersService.findOneId42(id42);
		const salt = await bcrypt.genSalt();
		const hashedAcToken = await bcrypt.hash(acToken, salt);
		const hashedRfToken = await bcrypt.hash(rfToken, salt);
		if (!user) {
			user = await this.usersService.create(hashedAcToken, hashedRfToken, id42, username, avatar);
		} else {
			user = await this.usersService.update(user.id, {accessToken: hashedAcToken, refreshToken: hashedRfToken});
		}
		return user;
	}
}
