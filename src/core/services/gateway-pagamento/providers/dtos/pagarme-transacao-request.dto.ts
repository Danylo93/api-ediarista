import { Expose } from 'class-transformer';

export class PagarmeTransacaoRequestDto {
  @Expose({ name: 'api_key' })
  apiKey: string;

  amount: number;

  @Expose({ name: 'card_hash' })
  cardHash: string;

  async: boolean;
}