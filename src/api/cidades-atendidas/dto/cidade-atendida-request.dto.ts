import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CidadeAtendidaRequestDto {
  @IsNotEmpty()
  cidade: string;

  @Expose({ name: 'codigo_ibge' })
  @IsNotEmpty()
  codigoIbge: string;
}
