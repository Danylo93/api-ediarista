import { DistanciaResponseDto } from './dto/distancia-response.dto';

export abstract class ConsultaDistanciaCep {
  abstract calcularDistanciaEntreDoisCeps(
    origem: string,
    destino: string,
  ): Promise<DistanciaResponseDto>;
}
