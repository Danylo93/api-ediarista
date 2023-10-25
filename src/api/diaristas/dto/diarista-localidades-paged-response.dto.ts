import { Expose } from 'class-transformer';
import { DiaristaLocalidadeResponse } from './create-diarista.dto';

export class DiaristaLocalidadesPagedResponse {
  diaristas: DiaristaLocalidadeResponse[];

  @Expose({ name: 'quantidade_diaristas' })
  tamanhoPagina: number;

  totalElementos: number;

  constructor(
    diaristas: DiaristaLocalidadeResponse[],
    tamanhoPagina: number,
    totalElementos: number,
  ) {
    this.diaristas = diaristas;
    this.tamanhoPagina =
      totalElementos > tamanhoPagina ? totalElementos - tamanhoPagina : 0;
  }
}
