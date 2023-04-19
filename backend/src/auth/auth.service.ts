import { HttpService } from '@nestjs/axios';
import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private httpService: HttpService) { }

  async getResourceOwnerAccessToken(authCode: string) {
    const options = {
      grant_type: "authorization_code",
      client_id: "u-s4t2ud-323464d0d3ecfc69260024761223d14b72b291dda193e39d980e413305d530d4",
      client_secret: "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",
      code: authCode,
      redirect_uri: "http://localhost:5173"
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
    username: string,
    avatar: string,
    status: string,
    rating: number,
    backgroundColor: string,
  ) {
    let user = await this.usersService.findOneId42(id42);
    if (!user) {
      user = await this.usersService.create(accessToken, refreshToken, id42, username, avatar, status, rating, backgroundColor);
      this.usersService.update(user.id, {username: username + user.id});
    } else {
      user = await this.usersService.update(user.id, { accessToken, refreshToken, id42, username, avatar, status, rating, backgroundColor });
    }
    return user;
  }

  async refreshToken(id: number) {
    const user = await this.usersService.findOneId(id);
    if (!user) throw new BadRequestException("invalid user id");
    const options = {
      grant_type: "refresh_token",
      client_id: "u-s4t2ud-323464d0d3ecfc69260024761223d14b72b291dda193e39d980e413305d530d4",
      client_secret: "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",
      refresh_token: user.refreshToken
    };
    const { data } = await firstValueFrom(this.httpService.post("https://api.intra.42.fr/oauth/token", options).pipe(catchError(() => {
      throw new ForbiddenException("cannot refresh token");
    })));
    return this.usersService.update(user.id, { accessToken: data.access_token, refreshToken: data.refresh_token });
  }
}
