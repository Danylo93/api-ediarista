import { CidadeResponseDto } from './dto/cidade-response.dto';

export abstract class ConsultaCidade {
  abstract busucarCidadePorCodigoIbge(
    codigoIbge: string,
  ): Promise<CidadeResponseDto>;
}
