import { HttpService } from '@nestjs/axios';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { UsersService } from '../users/users.service';
import Elo from 'src/pong/Matchmaking/Elo';
import { EnvService } from 'src/config/env.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private httpService: HttpService, private envService: EnvService) { }

  async getResourceOwnerAccessToken(authCode: string) {
    const options = {
      grant_type: "authorization_code",
      client_id: this.envService.get('API_CLIENT_ID'),
      client_secret: this.envService.get('API_SECRET'),
      code: authCode,
      redirect_uri: this.envService.get('API_REDIRECT_URI'),
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

  async getResourceOwnerData(tokens: any) {
    const { data } = (await firstValueFrom(this.httpService.get("https://api.intra.42.fr/v2/me", {
      params: {
        access_token: tokens.access_token,
      }
    })));
    return data;
  }

  async signIn(
    accessToken: string,
    refreshToken: string,
    id42: number,
    login: string,
  ) {
    let user = await this.usersService.findOneId42(id42);
    if (!user) {
      if (!login || !login.length) {
        login = 'User' + id42;
      }
      user = await this.usersService.create(
        accessToken,
        refreshToken,
        id42,
        login,
        `${this.envService.get('BACKEND_HOST')}/public/images/noavatar.png`,
        'online',
        Elo.defaultRating,
        'white',
        [],
      );
    }
    return user;
  }

  async refreshToken(id: number) {
    const user = await this.usersService.findOneId(id);
    if (!user) throw new BadRequestException("invalid user id");
    const options = {
      grant_type: "refresh_token",
      client_id: this.envService.get('API_CLIENT_ID'),
      client_secret: this.envService.get('API_SECRET'),
      refresh_token: user.refreshToken
    };
    const { data } = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options).pipe(catchError(() => {
      throw new ForbiddenException("cannot refresh token");
    })));
    return this.usersService.update(user.id, { accessToken: data.access_token, refreshToken: data.refresh_token });
  }
}
