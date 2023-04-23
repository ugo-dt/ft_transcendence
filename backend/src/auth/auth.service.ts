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
      client_id: "u-s4t2ud-0e31b61fc51b301f5e0594458baf1b0981c4106aff593588c1abb9708b7421c5",
      client_secret: "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",
      code: authCode,
      redirect_uri: "http://192.168.1.178:5173"
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
        "http://192.168.1.178:3000/public/images/noavatar.png",
        'online',
        Elo.defaultRating,
        'black',
        [],
      );
      this.usersService.setUsername(user.id, user.username + user.id);
    }
    return user;
  }

  async refreshToken(id: number) {
    const user = await this.usersService.findOneId(id);
    if (!user) throw new BadRequestException("invalid user id");
    const options = {
      grant_type: "refresh_token",
      client_id: "u-s4t2ud-0e31b61fc51b301f5e0594458baf1b0981c4106aff593588c1abb9708b7421c5",
      client_secret: "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",
      refresh_token: user.refreshToken
    };
    const { data } = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options).pipe(catchError(() => {
      throw new ForbiddenException("cannot refresh token");
    })));
    return this.usersService.update(user.id, { accessToken: data.access_token, refreshToken: data.refresh_token });
  }
}
