import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
	constructor(private httpService: HttpService) {}

	async getUserTokens(fCode: string) {
		const {data} = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "authorization_code",
			client_id: "u-s4t2ud-323464d0d3ecfc69260024761223d14b72b291dda193e39d980e413305d530d4",
			client_secret: "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",
			code: fCode,
			redirect_uri: "http://localhost:5173/auth"
		}));
		return data;
	}
}
