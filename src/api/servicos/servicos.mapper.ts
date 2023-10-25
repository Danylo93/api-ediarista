import { Injectable } from '@nestjs/common';
import { ServicoResponse } from './dto/servico-response.dto';
import { Servico } from './entities/servico.entity';

@Injectable()
export class ServicoMapper {
  toServicoResponseDto(servico: Servico): ServicoResponse {
    const servicoDTO = new ServicoResponse();
    servicoDTO.id = servico.id;
    servicoDTO.nome = servico.nome;
    servicoDTO.valorMinimo = this.converterReal(servico.valorMinimo);
    servicoDTO.quantidadeHoras = servico.quantidadeHoras;
    servicoDTO.porcentagem = servico.porcentagem;
    servicoDTO.valorQuarto = this.converterReal(servico.valorQuarto);
    servicoDTO.horasQuarto = servico.horasQuarto;
    servicoDTO.valorSala = this.converterReal(servico.valorSala);
    servicoDTO.horasSala = servico.horasSala;
    servicoDTO.valorBanheiro = this.converterReal(servico.valorBanheiro);
    servicoDTO.horasBanheiro = servico.horasBanheiro;
    servicoDTO.valorCozinha = this.converterReal(servico.valorCozinha);
    servicoDTO.horasCozinha = servico.horasCozinha;
    servicoDTO.valorQuintal = this.converterReal(servico.valorQuintal);
    servicoDTO.horasQuintal = servico.horasQuintal;
    servicoDTO.valorOutros = this.converterReal(servico.valorOutros);
    servicoDTO.horasOutros = servico.horasOutros;
    servicoDTO.icone = servico.icone;
    servicoDTO.posicao = servico.posicao;
    return servicoDTO;
  }

  private converterReal(valor: number) {
    valor = valor / 100;
    return valor.toFixed(2);
  }
}