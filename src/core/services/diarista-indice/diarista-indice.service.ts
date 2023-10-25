import { BadRequestException, Injectable } from '@nestjs/common';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import { GoogleMatrixService } from '../consulta-distancia/consulta-distancia.service';
import { DiaristaServiceSelecao } from './diarista-indice';

@Injectable()
export class DiaristaIndiceService implements DiaristaServiceSelecao {
  constructor(private consultaDistanciaService: GoogleMatrixService) {}
  async selecionarMelhorDiarista(diaria: Diaria): Promise<UsuarioApi> {
    this.validatorDiaria(diaria);
    return await this.calcularMelhorCanidato(diaria, diaria.cep);
  }

  private validatorDiaria(diaria: Diaria) {
    if (diaria.candidatos.length <= 0) {
      throw new Error('A lista de candidatos não pode estar vazia');
    }
  }

  private async calcularMelhorCanidato(
    diaria: Diaria,
    destino: string,
  ): Promise<UsuarioApi> {
    let maiorIndice = 0;
    let melhorCandidato: UsuarioApi;

    for (let i = 0; i < diaria.candidatos.length; i++) {
      const indiceCanditadoAtual = await this.calcularIndice(
        diaria.candidatos[i],
        destino,
      );

      if (indiceCanditadoAtual > maiorIndice) {
        melhorCandidato = diaria.candidatos[i];
        maiorIndice = indiceCanditadoAtual;
      }
    }

    return melhorCandidato;
  }

  private async calcularIndice(candidato: UsuarioApi, destino: string) {
    const origem = this.getCandidatoCep(candidato);
    const distancia = await this.getDistancia(destino, origem);
    const reputacao = candidato.reputacao;

    return (reputacao - distancia / 10.0) / 2.0;
  }

  private async getDistancia(destino: string, origem: string) {
    try {
      const googleMatrix =
        await this.consultaDistanciaService.calcularDistanciaEntreDoisCeps(
          origem,
          destino,
        );
      return googleMatrix.distanciaEmKm;
    } catch (error) {
      return Number.MAX_VALUE;
    }
  }

  private getCandidatoCep(candidato: UsuarioApi) {
    if (!candidato.endereco) {
      throw new BadRequestException('Candidato deve possuir endereço');
    }

    return candidato.endereco.cep;
  }
}
