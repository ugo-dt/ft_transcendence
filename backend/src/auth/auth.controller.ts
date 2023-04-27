import { Body, Controller, Post, Session, UseGuards } from '@nestjs/common';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { GenOtpAuthDto } from './dtos/gen-otp-auth.dto';
import { ValOtpAuthDto } from './dtos/val-top-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("signin")
  async signIn(@Body() body: LoginAuthDto, @Session() session: any) {
    const tokens = await this.authService.getResourceOwnerAccessToken(body.code);
    const info = await this.authService.getResourceOwnerInfo(tokens);
    const data = await this.authService.getResourceOwnerData(tokens);    
    const user = await this.authService.signIn(tokens.access_token, tokens.refresh_token, info.resource_owner_id, data.login);
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

  @Post('genotp')
  generateOtp(@Body() body: GenOtpAuthDto) {
    return this.authService.generateOtp(body.phoneNumber);
  }

  @Post('valotp')
  validateOtp(@Body() body: ValOtpAuthDto) {
    return this.authService.validateOtp(body.phoneNumber, body.code);
  }
}
