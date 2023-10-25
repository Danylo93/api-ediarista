import { Expose } from 'class-transformer';

export class PagarmeReembolsoResponseDto {
  id: string;
  status: string;
  amount: number;
  @Expose({ name: 'refunded_amount' })
  refundedAmout: number;
}
