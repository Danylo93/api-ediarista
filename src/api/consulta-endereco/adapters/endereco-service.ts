import { Injectable } from '@nestjs/common';
import { ViaCepService } from 'src/core/via-cep.service';
import { EnderecoResponse } from '../dto/endereco-response.dto';
import { IEndereco } from './IEndereco';

@Injectable()
export class EnderecoService implements IEndereco {
  constructor(private viaCep: ViaCepService) {}

  async buscarEnderecoCep(cep: string): Promise<EnderecoResponse> {
    return await this.viaCep.buscarEnderecoPorCep(cep);
  }
}
