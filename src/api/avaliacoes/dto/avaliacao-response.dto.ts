import { Expose } from 'class-transformer';

export class AvaliacaoResponseDto {
  descricao: string;
  nota: number;

  @Expose({ name: 'nome_avaliador' })
  nomeAvaliador: string;

  @Expose({ name: 'foto_avaliador' })
  fotoAvaliador: string;
}
