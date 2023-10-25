import { Expose } from 'class-transformer';

export class PagarmeReembolsoRequestDto {
  @Expose({ name: 'api_key' })
  apiKey: string;

  amount: number;
}