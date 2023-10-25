import { Injectable } from '@nestjs/common';
import { EnderecoResponse } from './dto/endereco-response.dto';

@Injectable()
export class EnderecoMapper {
  toEnderecoResponseDto(endereco): EnderecoResponse {
    const enderecoDTO = new EnderecoResponse();
    enderecoDTO.cep = endereco.cep;
    enderecoDTO.logradouro = endereco.logradouro;
    enderecoDTO.complemento = endereco.complemento;
    enderecoDTO.bairro = endereco.bairro;
    enderecoDTO.localidade = endereco.localidade;
    enderecoDTO.uf = endereco.uf;
    enderecoDTO.ibge = endereco.ibge;
    return enderecoDTO;
  }
}
