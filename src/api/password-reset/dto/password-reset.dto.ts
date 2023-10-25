import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordResetRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}