import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AvaliacaoRepository } from 'src/api/avaliacoes/avaliacao.repository';
import { Avaliacao } from 'src/api/avaliacoes/entities/avaliacao.entity';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';

@Injectable()
export class AvaliacaoValidator {
  constructor(private avaliacaoRepository: AvaliacaoRepository) {}

  async validar(
    avaliacao: Avaliacao,
    usuarioLogado: UsuarioApi,
    diaria: Diaria,
  ) {
    this.validarUsuarioDiaria(usuarioLogado, diaria);
    this.validarDiariaStatus(avaliacao);
    this.validarDiariaDataAtendimento(avaliacao);
    await this.validarAvaliador(avaliacao);
  }
  private async validarAvaliador(avaliacao: Avaliacao) {
    const avaliacoes = await this.avaliacaoRepository.repository.find({
      where: {
        diaria: {
          id: avaliacao.diaria.id,
        },
        avaliador: {
          id: avaliacao.avaliador.id,
        },
      },
    });

    if (avaliacoes.length > 0) {
      throw new BadRequestException('O Usuário já avaliou essa diária');
    }
  }

  private validarDiariaDataAtendimento(avaliacao: Avaliacao) {
    const dataHoje = new Date(Date.now());
    const dataAtendimento = avaliacao.diaria.dataAtendimento;

    if (dataHoje < dataAtendimento) {
      throw new BadRequestException('Diária com data de atendimento no futuro');
    }
  }

  private validarDiariaStatus(avaliacao: Avaliacao) {
    if (avaliacao.diaria.status !== DiariaStatus.CONCLUIDO) {
      throw new BadRequestException('Diária deve ter o Status Concluido');
    }
  }

  private validarUsuarioDiaria(usuarioLogado: UsuarioApi, diaria: Diaria) {
    if (!diaria.diarista) {
      throw new BadRequestException('Diaria não está apta para avaliação');
    }

    if (
      usuarioLogado.id !== diaria.diarista.id &&
      usuarioLogado.id !== diaria.cliente.id
    ) {
      throw new ForbiddenException('Acesso Negado');
    }
  }
}
