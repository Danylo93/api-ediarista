import { Expose, Type } from 'class-transformer';
import { IsDateString, IsOptional, Length, Validate } from 'class-validator';
import { CpfJaExiste } from 'src/core/validators/usuarios/validator-cpf';
import { EmailJaExiste } from 'src/core/validators/usuarios/validator-email';
import { IdadeValida } from 'src/core/validators/usuarios/validator-idade';
import { ChavePixJaExiste } from 'src/core/validators/usuarios/validator-pix';

export class UsuarioAtualizarRequestDto {
  @Type(() => String)
  @Length(3, 255, {
    message: 'Nome completo deve possuir entre 3 e 255 caracteres.',
  })
  @Expose({ name: 'nome_completo' })
  @IsOptional()
  nomeCompleto: string;

  @Length(3, 255, {
    message: 'Email deve possuir entre 3 e 255 caracteres.',
  })
  @Validate(EmailJaExiste)
  @IsOptional()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @Expose({ name: 'new_password' })
  newPassword: string;

  @IsOptional()
  @Expose({ name: 'password_confirmation' })
  passwordConfirmation: string;

  @Length(11, 11, {
    message: 'CPF deve possuir 11 caracteres.',
  })
  @Validate(CpfJaExiste)
  @IsOptional()
  cpf: string;

  @IsDateString('', { message: 'Data de nascimento deve ser uma data válida.' })
  @Validate(IdadeValida)
  @IsOptional()
  nascimento: Date;

  @Length(11, 11, {
    message: 'Telefone deve possuir 11 caracteres.',
  })
  @IsOptional()
  telefone: string;

  @IsOptional()
  @Expose({ name: 'chave_pix' })
  @Validate(ChavePixJaExiste)
  chavePix: string;
}