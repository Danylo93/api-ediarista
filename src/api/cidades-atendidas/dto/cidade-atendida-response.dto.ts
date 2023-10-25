import { Expose } from 'class-transformer';

export class CidadeAtendidaResponseDto {
  id: number;
  cidade: string;
  estado: string;
  @Expose({ name: 'codigo_ibge' })
  codigoIbge: string;
}
