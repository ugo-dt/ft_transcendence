import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString, Length } from 'class-validator';

export class ValOtpAuthDto {
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phoneNumber: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(6)
    code: string;
}