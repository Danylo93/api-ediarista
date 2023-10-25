import { Injectable } from '@nestjs/common';
import { GatewayPagamentoService } from 'src/core/services/gateway-pagamento/gateway-pagamento.service';
import { ValidatorPagamento } from 'src/core/validators/pagamento/validator-pagamento';
import { DiariaRepository } from '../diarias/diarias.repository';
import DiariaStatus from '../diarias/enum/diaria-status.enum';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { PagamentoRequestDto } from './dto/pagamento-request.dto';
import { PagamentoResponseDto } from './dto/pagamento-response.dto';
import { PagamentoStatus } from './enum/pagamento-status.enum';
import { PagamentoMapper } from './pagamento.mapper';
import { PagamentoRepository } from './pagamentos.repository';

@Injectable()
export class PagamentosService {
  constructor(
    private diariaRepository: DiariaRepository,
    private pagamentoValidator: ValidatorPagamento,
    private gataway: GatewayPagamentoService,
    private pagamentoRepository: PagamentoRepository,
    private pagamentoMapper: PagamentoMapper,
  ) {}
  async pagar(
    pagamentoDto: PagamentoRequestDto,
    id: number,
    usuarioLogado: UsuarioApi,
  ) {
    const diaria = await this.diariaRepository.repository.findOneBy({ id: id });
    this.pagamentoValidator.validarClienteDiaria(usuarioLogado, diaria);
    this.pagamentoValidator.validarStatus(diaria);

    const pagamento = await this.gataway.pagar(diaria, pagamentoDto.cardHash);

    if (pagamento.status === PagamentoStatus.ACEITO) {
      diaria.status = DiariaStatus.PAGO;
      this.diariaRepository.repository.save(diaria);
      return { message: 'Diária paga com sucesso' };
    }

    return { message: 'Pagamento Recusado' };
  }

  async listarPagamentoPorUsuarioLogado(
    usuarioLogado: UsuarioApi,
  ): Promise<PagamentoResponseDto[]> {
    const pagamentos =
      await this.pagamentoRepository.repository.findPagamentosPorUsuarioLogado(
        usuarioLogado,
      );

    return pagamentos.map((pagamento) =>
      this.pagamentoMapper.toResponse(pagamento),
    );
  }
}