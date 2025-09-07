import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import { Pagamento } from 'src/api/pagamentos/entities/pagamento.entity';
import { PagamentoStatus } from 'src/api/pagamentos/enum/pagamento-status.enum';
import { PagamentoRepository } from 'src/api/pagamentos/pagamentos.repository';
import { GatewayPagamentoService } from '../gateway-pagamento.service';

@Injectable()
export class StripeService implements GatewayPagamentoService {
  private stripe: Stripe;

  constructor(private pagamentoRepository: PagamentoRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2022-11-15',
    });
  }

  async pagar(diaria: Diaria, cardToken: string): Promise<Pagamento> {
    try {
      const charge = await this.stripe.charges.create({
        amount: Math.round(diaria.preco * 100),
        currency: 'brl',
        source: cardToken,
        description: `Diaria ${diaria.id}`,
      });
      return await this.criarPagamento(diaria, charge);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async realizarEstornoTotal(diaria: Diaria): Promise<Pagamento> {
    try {
      const pagamento = await this.getPagamentoDaDiaria(diaria);
      const refund = await this.stripe.refunds.create({
        charge: pagamento.transacaoId,
      });
      return this.criarPagamentoReembolso(diaria, refund);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async realizarEstornoParcial(diaria: Diaria): Promise<Pagamento> {
    try {
      const pagamento = await this.getPagamentoDaDiaria(diaria);
      const refund = await this.stripe.refunds.create({
        charge: pagamento.transacaoId,
        amount: Math.round((diaria.preco / 2) * 100),
      });
      return this.criarPagamentoReembolso(diaria, refund);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  private async criarPagamento(
    diaria: Diaria,
    charge: Stripe.Charge,
  ): Promise<Pagamento> {
    const pagamento = new Pagamento();
    pagamento.valor = diaria.preco;
    pagamento.transacaoId = charge.id;
    pagamento.status = this.criarPagamentoStatus(charge.status);
    pagamento.diaria = diaria;
    return await this.pagamentoRepository.repository.save(pagamento);
  }

  private criarPagamentoStatus(status: string): number {
    return status === 'succeeded'
      ? PagamentoStatus.ACEITO
      : PagamentoStatus.REPROVADO;
  }

  private async criarPagamentoReembolso(
    diaria: Diaria,
    refund: Stripe.Response<Stripe.Refund>,
  ): Promise<Pagamento> {
    const pagamento = new Pagamento();
    pagamento.valor = (refund.amount ?? 0) / 100;
    pagamento.transacaoId = refund.id;
    pagamento.status = PagamentoStatus.REEMBOLSADO;
    pagamento.diaria = diaria;
    return await this.pagamentoRepository.repository.save(pagamento);
  }

  private async getPagamentoDaDiaria(diaria: Diaria) {
    const pagamento =
      await this.pagamentoRepository.repository.findPagamentoParaReembolso(
        diaria,
      );

    if (!pagamento) {
      throw new NotFoundException('Pagamento Não Encontrado');
    }

    return pagamento;
  }
}

