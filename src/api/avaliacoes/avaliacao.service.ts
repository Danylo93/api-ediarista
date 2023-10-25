import { Injectable, NotFoundException } from '@nestjs/common';
import { NovaAvaliacaoEvents } from 'src/core/events/nova-avaliacao.events';
import { AvaliacaoValidator } from 'src/core/validators/avaliacao/validator-avaliacao';
import { DiariaRepository } from '../diarias/diarias.repository';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { AvaliacaoMapper } from './avaliacao.mapper';
import { AvaliacaoRepository } from './avaliacao.repository';
import { AvaliacaoRequestDto } from './dto/avaliacao-request.dto';
import { Avaliacao } from './entities/avaliacao.entity';

@Injectable()
export class AvaliacaoService {
  constructor(
    private avaliacaoRepository: AvaliacaoRepository,
    private diariaRepository: DiariaRepository,
    private avaliacaoMapper: AvaliacaoMapper,
    private avaliacaoValidator: AvaliacaoValidator,
    private avaliacaoEvent: NovaAvaliacaoEvents,
  ) {}

  async avaliarDiaria(
    avaliacaoRequest: AvaliacaoRequestDto,
    id: number,
    usuarioLogado: UsuarioApi,
  ) {
    const diaria = await this.buscarDiariaPorId(id);
    const avaliador = usuarioLogado;

    const avaliacao = this.avaliacaoMapper.toModel(avaliacaoRequest);
    avaliacao.avaliador = avaliador;
    avaliacao.diaria = diaria;
    avaliacao.visibilidade = true;
    avaliacao.avaliado = this.getAvaliado(avaliacao);
    await this.avaliacaoValidator.validar(avaliacao, usuarioLogado, diaria);

    const avaliacaoCadastrada = await this.avaliacaoRepository.repository.save(
      avaliacao,
    );

    this.avaliacaoEvent.NovaAvaliacaoEvent(avaliacaoCadastrada);

    return { message: 'Avaliação realizada com sucesso' };
  }
  private getAvaliado(avaliacao: Avaliacao): UsuarioApi {
    if (avaliacao.avaliador.tipoUsuario === TipoUsuario.CLIENTE) {
      return avaliacao.diaria.diarista;
    }

    return avaliacao.diaria.cliente;
  }

  private async buscarDiariaPorId(id: number) {
    const diaria = await this.diariaRepository.repository.findOneBy({
      id: id,
    });

    if (!diaria) {
      throw new NotFoundException('Diária não encontrada');
    }

    return diaria;
  }
}
