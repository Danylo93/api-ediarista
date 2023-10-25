import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HateoasDiaria } from 'src/core/hateoas/hateoas-diaria';
import { GatewayPagamentoService } from 'src/core/services/gateway-pagamento/gateway-pagamento.service';
import { ValidatorDiaria } from 'src/core/validators/diaria/validator-diaria';
import { ValidatorDiariaUsuario } from 'src/core/validators/diaria/validator-diaria-usuario';
import { Repository } from 'typeorm';
import { AvaliacaoRepository } from '../avaliacoes/avaliacao.repository';
import { Avaliacao } from '../avaliacoes/entities/avaliacao.entity';
import { Servico } from '../servicos/entities/servico.entity';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { DiariaMapper } from './diarias.mapper';
import { DiariaRepository } from './diarias.repository';
import { DiariaCancelamentoRequestDto } from './dto/diaria-cancelamento-request.dto';
import { DiariaRequestDto } from './dto/diaria-request.dto';
import { DiariaResponseDto } from './dto/diaria-response.dto';
import { Diaria } from './entities/diaria.entity';
import DiariaStatus from './enum/diaria-status.enum';

@Injectable()
export class DiariasService {
  constructor(
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,
    private diariaRepository: DiariaRepository,
    private diariaMapper: DiariaMapper,
    private validatorDiaria: ValidatorDiaria,
    private hateOas: HateoasDiaria,
    private validatorUsuario: ValidatorDiariaUsuario,
    private avaliacaoRepository: AvaliacaoRepository,
    private getawayPagamento: GatewayPagamentoService,
  ) {}
  async cadastrar(
    diariaRequestDto: DiariaRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    const horaLimiteAtendimento = 20;
    const servico = await this.servicoRepository.findOneBy({
      id: diariaRequestDto.servico,
    });

    await this.validatorDiaria.validarDiaria(
      diariaRequestDto,
      horaLimiteAtendimento,
      servico,
    );

    diariaRequestDto.valorComissao = this.calcularComissao(
      diariaRequestDto,
      servico,
    );

    diariaRequestDto.status = DiariaStatus.SEM_PAGAMENTO;

    diariaRequestDto.cliente = usuarioLogado;

    const diariaCadastrada =
      await this.diariaRepository.repository.createDiaria(
        diariaRequestDto,
        servico,
      );

    const diariaDto = this.diariaMapper.toDiariaResponseDto(diariaCadastrada);

    return { diariaDto: diariaDto, diaria: diariaCadastrada };
  }

  async listarPorUsuarioLogado(usuarioLogado: UsuarioApi) {
    if (usuarioLogado.tipoUsuario === TipoUsuario.CLIENTE) {
      const diarias = await this.diariaRepository.repository.findByCliente(
        usuarioLogado,
      );
      return Promise.all(
        diarias.map(async (diaria) => {
          const diariaDto = this.diariaMapper.toDiariaResponseDto(diaria);
          const avaliacao =
            await this.avaliacaoRepository.repository.findAvaliadorAndDiaria(
              usuarioLogado,
              diaria,
            );
          diariaDto.links = this.hateOas.gerarLinksHateos(
            usuarioLogado.tipoUsuario,
            diaria,
            avaliacao,
          );
          return diariaDto;
        }),
      );
    } else {
      const diarias = await this.diariaRepository.repository.findByDiarista(
        usuarioLogado,
      );
      return Promise.all(
        diarias.map(async (diaria) => {
          const diariaDto = this.diariaMapper.toDiariaResponseDto(diaria);
          const avaliacao =
            await this.avaliacaoRepository.repository.findAvaliadorAndDiaria(
              usuarioLogado,
              diaria,
            );
          diariaDto.links = this.hateOas.gerarLinksHateos(
            usuarioLogado.tipoUsuario,
            diaria,
            avaliacao,
          );
          return diariaDto;
        }),
      );
    }
  }

  async cancelar(
    diariaId: number,
    diariaCancelamentoRequestDto: DiariaCancelamentoRequestDto,
    usuarioLogado: UsuarioApi,
  ) {
    const { diaria } = await this.buscarPorId(diariaId, usuarioLogado);
    this.validatorDiaria.validarDiariaCancelamento(diaria);

    if (this.hasPenalizacao(diaria)) {
      this.aplicarPenalizacao(diaria, usuarioLogado);
    } else {
      this.getawayPagamento.realizarEstornoTotal(diaria);
    }

    diaria.status = DiariaStatus.CANCELADO;
    diaria.motivoCancelamento = diariaCancelamentoRequestDto.motivoCancelamento;
    this.diariaRepository.repository.save(diaria);

    return { mensagem: 'Diária cancelada com sucesso' };
  }

  private aplicarPenalizacao(diaria: Diaria, usuarioLogado: UsuarioApi) {
    if (usuarioLogado.tipoUsuario === TipoUsuario.DIARISTA) {
      this.penalizarDiarista(diaria);
      this.getawayPagamento.realizarEstornoTotal(diaria);
    } else {
      this.getawayPagamento.realizarEstornoParcial(diaria);
    }
  }

  private async penalizarDiarista(diaria: Diaria) {
    const avaliacao = new Avaliacao();
    avaliacao.nota = 1;
    avaliacao.descricao = 'Penalização por diária cancelada';
    avaliacao.avaliado = diaria.diarista;
    avaliacao.visibilidade = false;
    avaliacao.diaria = diaria;

    await this.avaliacaoRepository.repository.save(avaliacao);
  }

  private hasPenalizacao(diaria: Diaria): boolean {
    const hoje = new Date(Date.now());
    const diferencaDatas = new Date(
      diaria.dataAtendimento.getTime() - hoje.getTime(),
    );

    const converterParaHoras = 3600000;
    const diferencaHoras = diferencaDatas.getTime() / converterParaHoras;

    return diferencaHoras < 24 ? true : false;
  }

  async buscarPorId(
    id: number,
    usuarioLogado: UsuarioApi,
  ): Promise<{ diariaDto: DiariaResponseDto; diaria: Diaria }> {
    const diaria = await this.diariaRepository.repository.findOneBy({ id: id });
    if (!diaria) {
      throw new BadRequestException(`Diária de ID:${id} não encontrada`);
    }

    const diariaDto = await this.diariaMapper.toDiariaResponseDto(diaria);
    this.validatorUsuario.validarDiariaUsuario(usuarioLogado, diaria);
    return { diariaDto: diariaDto, diaria: diaria };
  }

  private calcularComissao(
    diariaRequestDto: DiariaRequestDto,
    servico: Servico,
  ): number {
    const preco = diariaRequestDto.preco;
    const porcentagem = servico.porcentagem;
    return (preco * porcentagem) / 100;
  }
}