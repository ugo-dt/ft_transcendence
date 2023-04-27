import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class GenOtpAuthDto {
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phoneNumber: string;
}