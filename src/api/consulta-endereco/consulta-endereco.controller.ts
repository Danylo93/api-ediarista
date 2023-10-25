import { Controller, Get, Query } from '@nestjs/common';
import { EnderecoService } from './adapters/endereco-service';
import { EnderecoResponse } from './dto/endereco-response.dto';
import { EnderecoMapper } from './endereco.mapper';

@Controller('api/enderecos')
export class ConsultaEnderecoController {
  constructor(
    private enderecoService: EnderecoService,
    private enderecoMapper: EnderecoMapper,
  ) {}

  @Get()
  async buscarEnderecoPorCep(
    @Query('cep') cep: string,
  ): Promise<EnderecoResponse> {
    const endereco = await this.enderecoService.buscarEnderecoCep(cep);
    return this.enderecoMapper.toEnderecoResponseDto(endereco);
  }
}
