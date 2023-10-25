import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class DiariaCancelamentoRequestDto {
  @IsNotEmpty()
  @Length(3, 255)
  @Expose({ name: 'motivo_cancelamento' })
  motivoCancelamento: string;
}