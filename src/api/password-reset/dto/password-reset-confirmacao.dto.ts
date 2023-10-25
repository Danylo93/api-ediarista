import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordResetConfirmacaoRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Expose({ name: 'password_confirmation' })
  passwordConfirmation: string;

  @IsNotEmpty()
  token: string;
}