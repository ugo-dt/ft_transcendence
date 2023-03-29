import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	constructor(private httpService: HttpService) {}

	async getUserTokens(code: string) {
		const tokens = await this.httpService.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "authorization_code",
			client_id: "",
			client_secret: "",
			code: code,
			redirect_uri: ""
		});
		return tokens;
	}
}
