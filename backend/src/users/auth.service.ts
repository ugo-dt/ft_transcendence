import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService, private httpService: HttpService) {}

	async getUserTokens(fCode: string) {
		const options = {
			grant_type: "authorization_code",
			client_id: "u-s4t2ud-323464d0d3ecfc69260024761223d14b72b291dda193e39d980e413305d530d4",
			client_secret: "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",
			code: fCode,
			redirect_uri: "http://localhost:5173/auth"
		};
		const currentTime = Date.now();
		const {data} = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options));
		return {
			accessToken: data.access_token,
			expirationTime: currentTime + data.expires_in,
			refreshToken: data.refresh_token
		};
	}

	async getTokenInfo(accessToken: string) {
		const {data} = await firstValueFrom(this.httpService.get("https://api.intra.42.fr/oauth/token/info", {
			params: {
				access_token: accessToken
			}
		}));
		return data.resource_owner_id;
	}

	async signIn(tokens: any, id42: number) {
		const user = await this.usersService.find(id42);
		if (!user.length) {
			const newUser = await this.usersService.create(
				tokens.accessToken,
				tokens.expirationTime,
				tokens.refreshToken,
				id42,
				"(placeholder)",
				"(placeholder)"
			);
			return newUser;
		}
		const updateUser = await this.usersService.update(user[0].id, {
			accessToken: tokens.accessToken,
			expirationTime: tokens.expirationTime,
			refreshToken: tokens.refreshToken
		});
		return updateUser;
	}
}
