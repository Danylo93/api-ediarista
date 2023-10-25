import { Expose } from 'class-transformer';

export class PagamentoRequestDto {
  @Expose({ name: 'card_hash' })
  cardHash: string;
}
