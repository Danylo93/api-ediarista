import { Injectable } from '@nestjs/common';
import { DiaristaMapper } from './diaristas.mapper';
import { DiaristaRepository } from './diaristas.repository';
import { EnderecoService } from '../consulta-endereco/adapters/endereco-service';
import { DiaristaLocalidadesPagedResponse } from './dto/diarista-localidades-paged-response.dto';
import { DisponibilidadeResponse } from './dto/disponibilidade-response.dto';

@Injectable()
export class DiaristasService {
  constructor(
    private diaristaRpository: DiaristaRepository,
    private diaristaMapper: DiaristaMapper,
    private enderecoService: EnderecoService,
  ) {}
  async buscarDiaristaPorCep(cep: string) {
    const codigoIbge = await this.buscarCodigoIbgePorCep(cep);
    const pageSize = 6;
    const usuarios =
      await this.diaristaRpository.repository.buscarDiaristaPorCodigoIbge(
        codigoIbge,
        pageSize,
      );
    const diaristas = usuarios.content.map((usuario) =>
      this.diaristaMapper.toDiaristaLocalidadeResponseDto(usuario),
    );

    return new DiaristaLocalidadesPagedResponse(
      diaristas,
      pageSize,
      usuarios.totalElementos,
    );
  }

  async verificarDisponibilidadePorCep(cep: string) {
    const codigoIbge = await this.buscarCodigoIbgePorCep(cep);

    const disponibilidade =
      await this.diaristaRpository.repository.existsByCidadesAtendidasCodigoIbge(
        codigoIbge,
      );

    return new DisponibilidadeResponse(disponibilidade);
  }

  private async buscarCodigoIbgePorCep(cep: string) {
    return await (
      await this.enderecoService.buscarEnderecoCep(cep)
    ).ibge;
  }
}
