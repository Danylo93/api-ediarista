import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { ConsultaDistanciaCep } from './consulta-distancia';
import { DistanciaResponseDto } from './dto/distancia-response.dto';

export class GoogleMatrixService implements ConsultaDistanciaCep {
  API_KEY = process.env.GOOGLE_API_KEY;

  async calcularDistanciaEntreDoisCeps(
    origem: string,
    destino: string,
  ): Promise<DistanciaResponseDto> {
    this.validarCep(origem);
    this.validarCep(destino);

    const URL_GOOGLE_MAPS = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destino}&origins=${origem}&key=${this.API_KEY}`;

    const dadosDistancia = new DistanciaResponseDto();

    const matrixApiData = await axios.get(URL_GOOGLE_MAPS);

    dadosDistancia.distanciaEmKm =
      matrixApiData.data.rows[0].elements[0].distance.value / 1000.0;

    dadosDistancia.origem = matrixApiData.data.origin_addresses[0];
    dadosDistancia.destino = matrixApiData.data.destination_addresses[0];

    return dadosDistancia;
  }

  private validarCep(cep: string) {
    if (cep.length != 8) {
      throw new BadRequestException('O CEP deve ter 8 digitos');
    }

    if (!cep.match(/^[0-9]+$/)) {
      throw new BadRequestException('O CEP deve possuir apenas números');
    }
  }
}
