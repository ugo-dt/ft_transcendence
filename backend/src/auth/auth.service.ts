import { HttpService } from '@nestjs/axios';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { UsersService } from '../users/users.service';
import Elo from 'src/pong/Matchmaking/Elo';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private httpService: HttpService) { }

  async getResourceOwnerAccessToken(authCode: string) {
    const options = {
      grant_type: "authorization_code",
      client_id: "u-s4t2ud-8b655c7560f459606bfba1ea913c3d38861494de821c10eba2eb12b2321362f6",
      client_secret: "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",
      code: authCode,
      redirect_uri: "http://192.168.1.136:5173"
    };
    const { data } = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options).pipe(catchError(() => {
      throw new ForbiddenException("invalid authorization code");
    })));
    return data;
  }

  async getResourceOwnerInfo(tokens: any) {
    const { data } = await firstValueFrom(this.httpService.get("https://api.intra.42.fr/oauth/token/info", {
      params: {
        access_token: tokens.access_token,
      }
    }).pipe(catchError(() => {
      throw new UnauthorizedException("invalid access token");
    })));
    return data;
  }

  async signIn(
    accessToken: string,
    refreshToken: string,
    id42: number,
  ) {
    let user = await this.usersService.findOneId42(id42);
    if (!user) {
      user = await this.usersService.create(
        accessToken,
        refreshToken,
        id42,
        "User",
        "http://192.168.1.136:3000/public/images/noavatar.png",
        'online',
        Elo.defaultRating,
        'white',
        [],
		[],
		[],
      );
      this.usersService.setUsername(user.id, user.username + user.id42);
    }
    return user;
  }

  async refreshToken(id: number) {
    const user = await this.usersService.findOneId(id);
    if (!user) throw new BadRequestException("invalid user id");
    const options = {
      grant_type: "refresh_token",
      client_id: "u-s4t2ud-8b655c7560f459606bfba1ea913c3d38861494de821c10eba2eb12b2321362f6",
      client_secret: "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",
      refresh_token: user.refreshToken
    };
    const { data } = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options).pipe(catchError(() => {
      throw new ForbiddenException("cannot refresh token");
    })));
    return this.usersService.update(user.id, { accessToken: data.access_token, refreshToken: data.refresh_token });
  }
}
