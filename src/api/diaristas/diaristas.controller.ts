import { Controller, Get, Query } from '@nestjs/common';
import { DiaristasService } from './diaristas.service';

@Controller('api/diaristas')
export class DiaristasController {
  constructor(private readonly diaristasService: DiaristasService) {}

  @Get('localidades')
  async buscarPorCep(@Query('cep') cep: string) {
    return await this.diaristasService.buscarDiaristaPorCep(cep);
  }
  // verifica disponibilidade
  @Get('disponibilidade')
  async verificarDisponibilidadePorCep(@Query('cep') cep: string) {
    return await this.diaristasService.verificarDisponibilidadePorCep(cep);
  }
}
