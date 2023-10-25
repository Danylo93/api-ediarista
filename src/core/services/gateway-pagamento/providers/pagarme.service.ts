import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { NotFoundError } from 'rxjs';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import { Pagamento } from 'src/api/pagamentos/entities/pagamento.entity';
import { PagamentoStatus } from 'src/api/pagamentos/enum/pagamento-status.enum';
import { PagamentoRepository } from 'src/api/pagamentos/pagamentos.repository';
import { GatewayPagamentoService } from '../gateway-pagamento.service';
import { PagarmeReembolsoRequestDto } from './dtos/pagarme-reembolso-request.dto';
import { PagarmeReembolsoResponseDto } from './dtos/pagarme-reembolso-response.dto';
import { PagarmeTransacaoRequestDto } from './dtos/pagarme-transacao-request.dto';
import { PagarmeTransacaoResponseDto } from './dtos/pagarme-transacao-response.dto';

@Injectable()
export class PagarmeService implements GatewayPagamentoService {
  constructor(private pagamentoRepository: PagamentoRepository) {}

  BASE_URL = 'https://api.pagar.me/1';
  API_KEY = process.env.API_KEY_PAGARME;

  async pagar(diaria: Diaria, cardHash: string): Promise<Pagamento> {
    try {
      return await this.tryPagar(diaria, cardHash);
    } catch (error) {
      throw new BadRequestException(error.response.data.errors);
    }
  }

  async realizarEstornoTotal(diaria: Diaria): Promise<Pagamento> {
    try {
      return await this.tryRealizarEstornoTotal(diaria);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.response.data.errors);
    }
  }

  realizarEstornoParcial(diaria: Diaria): Promise<Pagamento> {
    const request = new PagarmeReembolsoRequestDto();
    request.apiKey = this.API_KEY;
    request.amount = diaria.preco / 2;
    return this.realizarEstorno(diaria, request);
  }

  private tryRealizarEstornoTotal(diaria: Diaria): Promise<Pagamento> {
    const request = new PagarmeReembolsoRequestDto();
    request.apiKey = this.API_KEY;
    return this.realizarEstorno(diaria, request);
  }

  private async realizarEstorno(
    diaria: Diaria,
    request: PagarmeReembolsoRequestDto,
  ): Promise<Pagamento> {
    const pagamento = await this.getPagamentoDaDiaria(diaria);
    const url = `${this.BASE_URL}/transactions/${pagamento.transacaoId}/refund`;
    const response = await axios.post(url, instanceToPlain(request));
    return this.criarPagamentoReembolso(diaria, response.data);
  }

  private async criarPagamentoReembolso(
    diaria: Diaria,
    body: PagarmeReembolsoResponseDto,
  ): Promise<Pagamento> {
    const response = plainToInstance(PagarmeReembolsoResponseDto, body);
    const pagamento = new Pagamento();
    pagamento.valor = response.refundedAmout / 100;
    pagamento.transacaoId = response.id;
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

  private async tryPagar(diaria: Diaria, cardHash: string) {
    const transacaoRequest = this.criarTransacaoRequest(diaria, cardHash);
    const url = `${this.BASE_URL}/transactions`;
    const response = await axios.post(url, instanceToPlain(transacaoRequest));
    return this.criarPagamento(diaria, response.data);
  }

  private async criarPagamento(
    diaria: Diaria,
    body: PagarmeTransacaoResponseDto,
  ) {
    const pagamento = new Pagamento();
    pagamento.valor = diaria.preco;
    pagamento.transacaoId = body.id;
    pagamento.status = this.criarPagamentoStatus(body.status);
    pagamento.diaria = diaria;
    return await this.pagamentoRepository.repository.save(pagamento);
  }
  private criarPagamentoStatus(status: string): number {
    return status === 'paid'
      ? PagamentoStatus.ACEITO
      : PagamentoStatus.REPROVADO;
  }

  private criarTransacaoRequest(diaria: Diaria, cardHash: string) {
    const transacaoRequest = new PagarmeTransacaoRequestDto();
    transacaoRequest.amount = diaria.preco;
    transacaoRequest.cardHash = cardHash;
    transacaoRequest.async = false;
    transacaoRequest.apiKey = this.API_KEY;
    return transacaoRequest;
  }
}
