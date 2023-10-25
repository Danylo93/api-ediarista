import { Expose } from 'class-transformer';

export class PagamentoResponseDto {
  id: number;

  status: number;

  valor: number;

  @Expose({ name: 'valor_deposito' })
  valorDeposito: number;

  @Expose({ name: 'created_at' })
  createdAt: Date;
}