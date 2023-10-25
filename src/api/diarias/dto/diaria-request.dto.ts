import { Exclude, Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import { DataAtendimentoInicio } from 'src/core/validators/diaria/validator-data-atendimento-inicio';
import { ServicoExiste } from 'src/core/validators/diaria/validator-servico';

export class DiariaRequestDto {
  @IsNotEmpty({ message: 'Data Atendimento não pode ser vazio' })
  @Expose({ name: 'data_atendimento' })
  @Validate(DataAtendimentoInicio, [7])
  dataAtendimento: Date;

  @IsNotEmpty({ message: 'Tempo Atendimento não pode ser vazio' })
  @Expose({ name: 'tempo_atendimento' })
  tempoAtendimento: number;

  @IsNotEmpty({ message: 'Preço não pode ser vazio' })
  preco: number;

  @IsNotEmpty({ message: 'Logradouro não pode ser vazio' })
  @Length(3, 60, { message: 'Logradouro deve possuir de 3 até 60 caracteres' })
  logradouro: string;

  @IsNotEmpty({ message: 'Número não pode ser vazio' })
  numero: number;

  @IsNotEmpty({ message: 'Bairro não pode ser vazio' })
  @Length(3, 60, { message: 'Bairro deve possuir de 3 até 60 caracteres' })
  bairro: string;

  @IsOptional()
  complemento: string;

  @IsNotEmpty({ message: 'Cidade não pode ser vazio' })
  @Length(2, 60, { message: 'Cidade deve possuir de 2 até 60 caracteres' })
  cidade: string;

  @IsNotEmpty({ message: 'Estado não pode ser vazio' })
  @Length(2, 60, { message: 'Estado deve possuir de 2 até 60 caracteres' })
  estado: string;

  @IsNotEmpty({ message: 'CEP não pode ser vazio' })
  cep: string;

  @IsNotEmpty({ message: 'Código Ibge não pode ser vazio' })
  @Expose({ name: 'codigo_ibge' })
  codigoIbge: string;

  @IsNotEmpty({ message: 'Quantidade Quartos não pode ser vazio' })
  @Expose({ name: 'quantidade_quartos' })
  @Max(10, {
    message: 'Quantidade quartos deve ser no máximo 10',
  })
  quantidadeQuartos: number;

  @IsNotEmpty({ message: 'Quantidade Salas não pode ser vazio' })
  @Expose({ name: 'quantidade_salas' })
  @Max(10, {
    message: 'Quantiidade Salas deve ser no máximo 10',
  })
  quantidadeSalas: number;

  @IsNotEmpty({ message: 'Quantidade Cozinhas não pode ser vazio' })
  @Expose({ name: 'quantidade_cozinhas' })
  @Max(10, {
    message: 'Quantidade Cozinhas deve ser no máximo 10',
  })
  quantidadeCozinhas: number;

  @IsNotEmpty({ message: 'Quantidade Banheiros não pode ser vazio' })
  @Expose({ name: 'quantidade_banheiros' })
  @Max(10, {
    message: 'Quantidade banheiros deve ser no máximo 10',
  })
  quantidadeBanheiros: number;

  @IsNotEmpty({ message: 'Quantidade Quintais não pode ser vazio' })
  @Expose({ name: 'quantidade_quintais' })
  @Max(10, {
    message: 'Quantidade Quintais deve ser no máximo 10',
  })
  quantidadeQuintais: number;

  @IsNotEmpty({ message: 'Quantidade Outros não pode ser vazio' })
  @Expose({ name: 'quantidade_outros' })
  @Max(10, {
    message: 'Quantidade outros deve ser no máximo 10',
  })
  quantidadeOutros: number;

  @IsOptional()
  observacoes: string;

  @IsOptional()
  @Expose({ name: 'motivo_cancelamento' })
  motivoCancelamento: string;

  @IsNotEmpty()
  @Min(0)
  @Validate(ServicoExiste)
  servico: number;

  @Exclude()
  valorComissao: number;

  @Exclude()
  cliente: UsuarioApi;

  @Exclude()
  status: number;
}
