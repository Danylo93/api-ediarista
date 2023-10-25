import { Injectable } from '@nestjs/common';
import { AvaliacaoMapper } from '../avaliacoes/avaliacao.mapper';
import { AvaliacaoRepository } from '../avaliacoes/avaliacao.repository';
import { DiariaMapper } from '../diarias/diarias.mapper';
import { DiariaRepository } from '../diarias/diarias.repository';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';

@Injectable()
export class OportunidadesService {
  constructor(
    private diariaRepository: DiariaRepository,
    private diariaMapper: DiariaMapper,
    private avaliacaoRepository: AvaliacaoRepository,
    private avaliacaoMapper: AvaliacaoMapper,
  ) {}

  async buscarOportunidades(usuarioLogado: UsuarioApi) {
    const cidades = usuarioLogado.cidadesAtendidas.map(
      (cidade) => cidade.codigoIbge,
    );

    const diarias = await this.diariaRepository.repository.findOportunidades(
      cidades,
      usuarioLogado,
    );

    const diariaResponseDto = [];
    for (let i = 0; i < diarias.length; i++) {
      diariaResponseDto[i] = this.diariaMapper.toDiariaResponseDto(diarias[i]);

      const avaliacoes =
        await this.avaliacaoRepository.repository.findByAvaliado(
          diarias[i].cliente,
        );

      diariaResponseDto[i].avaliacao = avaliacoes.map((avaliacao) =>
        this.avaliacaoMapper.toResponse(avaliacao),
      );
    }

    return { diariaResponseDto: diariaResponseDto, diarias: diarias };
  }
}
