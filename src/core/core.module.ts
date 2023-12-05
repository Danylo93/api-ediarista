import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiariaRepository } from 'src/api/diarias/diarias.repository';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import { Pagamento } from 'src/api/pagamentos/entities/pagamento.entity';
import { PagamentoRepository } from 'src/api/pagamentos/pagamentos.repository';
import { ConsultaCidade } from './services/consulta-cidade/consulta-cidade';
import { IbgeService } from './services/consulta-cidade/consulta-cidade.service';
import { ConsultaDistanciaCep } from './services/consulta-distancia/consulta-distancia';
import { GoogleMatrixService } from './services/consulta-distancia/consulta-distancia.service';
import { DiaristaServiceSelecao } from './services/diarista-indice/diarista-indice';
import { DiaristaIndiceService } from './services/diarista-indice/diarista-indice.service';
import { GatewayPagamentoService } from './services/gateway-pagamento/gateway-pagamento.service';
import { PagarmeService } from './services/gateway-pagamento/providers/pagarme.service';
import { ScheduleTask } from './tasks/schedule-task';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Diaria, Pagamento]),
  ],
  controllers: [],
  providers: [
    DiariaRepository,
    ScheduleTask,
    DiaristaIndiceService,
    GoogleMatrixService,
    PagamentoRepository,
    {
      provide: ConsultaCidade,
      useClass: IbgeService,
    },
    {
      provide: ConsultaDistanciaCep,
      useClass: GoogleMatrixService,
    },
    {
      provide: DiaristaServiceSelecao,
      useClass: DiaristaIndiceService,
    },
    {
      provide: GatewayPagamentoService,
      useClass: PagarmeService,
    },
  ],
})
export class CoreModule {}
