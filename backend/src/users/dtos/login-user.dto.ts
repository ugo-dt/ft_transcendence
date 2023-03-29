import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
	@IsNotEmpty()
	@IsString()
	code: string;
}