import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class EnderecoDiaristaRequestDto {
  @Exclude()
  id: number;

  @IsNotEmpty()
  @Length(3, 60)
  logradouro: string;

  @IsNotEmpty()
  @Length(1, 10)
  numero: string;

  @IsNotEmpty()
  @Length(3, 30)
  bairro: string;

  @IsOptional()
  complemento: string;

  @IsNotEmpty()
  @Length(1, 8)
  cep: string;

  @IsNotEmpty()
  @Length(3, 20)
  cidade: string;

  @IsNotEmpty()
  @Length(2, 2)
  estado: string;
}
