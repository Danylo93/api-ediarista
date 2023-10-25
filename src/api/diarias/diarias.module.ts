import { Module } from '@nestjs/common';
import { DiariasService } from './diarias.service';
import { DiariasController } from './diarias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diaria } from './entities/diaria.entity';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { Servico } from '../servicos/entities/servico.entity';
import { DiaristaRepository } from '../diaristas/diaristas.repository';
import { DiariaMapper } from './diarias.mapper';
import { DiariaRepository } from './diarias.repository';
import { ClienteMapper } from '../clientes/cliente.mapper';
import { ServicoExiste } from 'src/core/validators/diaria/validator-servico';
import { DataAtendimentoInicio } from 'src/core/validators/diaria/validator-data-atendimento-inicio';
import { ValidatorDiaria } from 'src/core/validators/diaria/validator-diaria';
import { ViaCepService } from 'src/core/via-cep.service';
import { HateoasDiaria } from 'src/core/hateoas/hateoas-diaria';
import { DiaristaMapper } from '../diaristas/diaristas.mapper';
import { ValidatorDiariaUsuario } from 'src/core/validators/diaria/validator-diaria-usuario';
import { AvaliacaoRepository } from '../avaliacoes/avaliacao.repository';
import { AvaliacaoMapper } from '../avaliacoes/avaliacao.mapper';
import { Avaliacao } from '../avaliacoes/entities/avaliacao.entity';
import { GatewayPagamentoService } from 'src/core/services/gateway-pagamento/gateway-pagamento.service';
import { PagarmeService } from 'src/core/services/gateway-pagamento/providers/pagarme.service';
import { Pagamento } from '../pagamentos/entities/pagamento.entity';
import { PagamentoRepository } from '../pagamentos/pagamentos.repository';
import { HateoasUsuario } from 'src/core/hateoas/hateoas-usuario';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Diaria,
      UsuarioApi,
      Servico,
      Avaliacao,
      Pagamento,
    ]),
  ],
  controllers: [DiariasController],
  providers: [
    DiariasService,
    DiaristaRepository,
    DiariasService,
    DiariaMapper,
    DiariaRepository,
    ClienteMapper,
    DiaristaMapper,
    ServicoExiste,
    DataAtendimentoInicio,
    ValidatorDiaria,
    ValidatorDiariaUsuario,
    ViaCepService,
    HateoasDiaria,
    AvaliacaoRepository,
    PagamentoRepository,
    {
      provide: GatewayPagamentoService,
      useClass: PagarmeService,
    },
  ],
})
export class DiariasModule {}