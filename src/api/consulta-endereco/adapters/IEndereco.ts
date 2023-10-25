import { EnderecoResponse } from '../dto/endereco-response.dto';

export abstract class IEndereco {
  abstract buscarEnderecoCep(cep: string): Promise<EnderecoResponse>;
}
