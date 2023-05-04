import { Global, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '..', '.env'),
      expandVariables: true,
    }),
  ],
  providers: [EnvService],
  exports: [ConfigModule, EnvService],
})
@Global()
export class EnvModule { }
