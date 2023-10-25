import DiariaStatus from '../diarias/enum/diaria-status.enum';
import { PagamentoResponseDto } from './dto/pagamento-response.dto';
import { Pagamento } from './entities/pagamento.entity';

export class PagamentoMapper {
  toResponse(pagamento: Pagamento): PagamentoResponseDto {
    const pagamentoResponseDto = new PagamentoResponseDto();
    pagamentoResponseDto.id = pagamento.id;
    pagamentoResponseDto.status = this.pagamentoStatus(pagamento);
    pagamentoResponseDto.valor = pagamento.valor / 100;
    pagamentoResponseDto.valorDeposito =
      this.calculoValorDeposito(pagamento) / 100;
    pagamentoResponseDto.createdAt = pagamento.createdAt;

    return pagamentoResponseDto;
  }

  private calculoValorDeposito(pagamento: Pagamento): number {
    return pagamento.diaria.preco - pagamento.diaria.valorComissao;
  }

  private pagamentoStatus(pagamento: Pagamento): number {
    return DiariaStatus.TRANSFERIDO === pagamento.diaria.status ? 1 : 2;
  }
}