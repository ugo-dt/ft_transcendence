import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  private static configService: ConfigService;

  constructor(private configService: ConfigService) {
    this.configService = configService;
  }

  get<T = string>(name: string): T {
    const envVar = this.configService.get<T>(name);
    if (!envVar) {
      throw new InternalServerErrorException(`${name} is undefined`)
    };
    return envVar;
  }

  public static get<T = string>(name: string): T {
    const envVar = EnvService.configService.get<T>(name);
    if (!envVar) {
      throw new InternalServerErrorException(`${name} is undefined`)
    };
    return envVar;
  }
}