import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ValLoginOtpAuthDto {
    @IsNotEmpty()
    @IsNumberString()
    @Length(6)
    code: string;
}