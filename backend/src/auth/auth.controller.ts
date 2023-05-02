import { Body, Controller, NotFoundException, Post, Session, UseGuards } from '@nestjs/common';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { GenOtpAuthDto } from './dtos/gen-otp-auth.dto';
import { ValOtpAuthDto } from './dtos/val-otp-auth.dto';
import { Wait2fa } from './guards/wait2fa.guard';
import { UsersService } from '../users/users.service';
import { ValLoginOtpAuthDto } from './dtos/val-login-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersServices: UsersService) { }

  @Post("signin")
  async signIn(@Body() body: LoginAuthDto, @Session() session: any) {
    const tokens = await this.authService.getResourceOwnerAccessToken(body.code);
    const info = await this.authService.getResourceOwnerInfo(tokens);
    const data = await this.authService.getResourceOwnerData(tokens);    
    const user = await this.authService.signIn(tokens.access_token, tokens.refresh_token, info.resource_owner_id, data.login);
    if (user.has2fa) {
      session.waitingFor2fa = user.phoneNumber;
      return false;
    } else {
      session.userId = user.id;
      return true;
    }
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
  @UseGuards(AuthGuard)
  generateOtp(@Body() body: GenOtpAuthDto) {
    return this.authService.generateOtp(body.phoneNumber);
  }

  @Post('valotp')
  @UseGuards(AuthGuard)
  validateOtp(@Body() body: ValOtpAuthDto, @Session() session: any) {
    return this.authService.validateOtp(parseInt(session.userId), body.phoneNumber, body.code);
  }

  @Post('genloginotp')
  @UseGuards(Wait2fa)
  generateLoginOtp(@Session() session: any) {
    return this.authService.generateOtp(session.waitingFor2fa);
  }

  @Post('valloginotp')
  @UseGuards(Wait2fa)
  async validateLoginOtp(@Body() body: ValLoginOtpAuthDto, @Session() session: any) {
    const user = await this.usersServices.findOnePhoneNumber(session.waitingFor2fa);
    if (!user) throw new NotFoundException('user does not exist');
    await this.authService.validateOtp(user.id, session.waitingFor2fa, body.code);
    session.userId = user.id;
    session.waitingFor2fa = null;
  }
}
