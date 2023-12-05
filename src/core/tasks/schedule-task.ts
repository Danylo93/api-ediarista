import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DiariaRepository } from 'src/api/diarias/diarias.repository';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { DiaristaIndiceService } from '../services/diarista-indice/diarista-indice.service';
import { GatewayPagamentoService } from '../services/gateway-pagamento/gateway-pagamento.service';

@Injectable()
export class ScheduleTask {
  constructor(
    private diariaRepository: DiariaRepository,
    private indice: DiaristaIndiceService,
    private pagamento: GatewayPagamentoService,
  ) {}
  private readonly logger = new Logger(ScheduleTask.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async selecionarDiaristaDiaria() {
    this.logger.debug(
      'Task de seleção de diaristas para diárias aptas iniciada',
    );

    const diariasAptasParaSelecao =
      await this.diariaRepository.repository.getAptasParaSelecaoDiarista();

    diariasAptasParaSelecao.forEach(
      async (diaria) => await this.selecionarDiarista(diaria),
    );

    this.logger.debug('Task de seleção de diarias finalizada');
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async cancelarDariaSemCandidato(): Promise<void> {
    this.logger.debug(
      'Iniciando task de cancelamento de diárias sem candidatos',
    );

    const diariaAptaParaCancelamento =
      await this.diariaRepository.repository.getAptasParaCancelamento();

    diariaAptaParaCancelamento.map(
      async (diaria) => await this.cancelarDiaria(diaria),
    );

    this.logger.debug('Task de cancelamento de diárias finalizada');
  }

  private async cancelarDiaria(diaria: Diaria): Promise<void> {
    this.logger.debug(`Cancelando diária de id: ${diaria.id}`);

    if (diaria.status === DiariaStatus.PAGO) {
      this.logger.debug(`Reembolsando pagamento de diaria de id: ${diaria.id}`);
      await this.pagamento.realizarEstornoTotal(diaria);
    }

    diaria.status = DiariaStatus.CANCELADO;
    await this.diariaRepository.repository.save(diaria);
    this.logger.debug(`Diária de id: ${diaria.id} cancelada com sucesso`);
  }

  private async selecionarDiarista(diaria: Diaria) {
    this.logger.debug(
      `Selecionando melhor diarista para a diária de id: ${diaria.id}`,
    );

    const melhorDiarista = await this.indice.selecionarMelhorDiarista(diaria);
    diaria.diarista = melhorDiarista;
    diaria.status = DiariaStatus.CONFIRMADO;
    await this.diariaRepository.repository.save(diaria);
    this.logger.debug(
      `Selecionado o diarista de id: ${diaria.diarista.id} para a diaria de id: ${diaria.id}`,
    );
  }
}
