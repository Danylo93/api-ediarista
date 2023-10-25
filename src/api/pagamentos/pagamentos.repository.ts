import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diaria } from '../diarias/entities/diaria.entity';
import DiariaStatus from '../diarias/enum/diaria-status.enum';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { Pagamento } from './entities/pagamento.entity';
import { PagamentoStatus } from './enum/pagamento-status.enum';

export class PagamentoRepository {
  constructor(
    @InjectRepository(Pagamento)
    private pagamentoRepository: Repository<Pagamento>,
  ) {}

  repository = this.pagamentoRepository.extend({
    async findPagamentoParaReembolso(diaria: Diaria): Promise<Pagamento> {
      const pagamento = await this.createQueryBuilder('pagamento')
        .select('pagamento')
        .where('pagamento.diaria_id = :id', { id: diaria.id })
        .andWhere('pagamento.status = :status', {
          status: PagamentoStatus.ACEITO,
        })
        .getOne();

      return pagamento;
    },
    async findPagamentosPorUsuarioLogado(
      usuarioLogado: UsuarioApi,
    ): Promise<Pagamento[]> {
      const status = [
        DiariaStatus.CONCLUIDO,
        DiariaStatus.AVALIADO,
        DiariaStatus.TRANSFERIDO,
      ];
      const pagamentos = await this.createQueryBuilder('pagamento')
        .select('pagamento')
        .leftJoinAndSelect('pagamento.diaria', 'diaria')
        .where('diarista_id = :id', { id: usuarioLogado.id })
        .andWhere('diaria.status IN(:status)', { status: status })
        .getMany();

      return pagamentos;
    },
  });
}