import { Module } from '@nestjs/common';
import { ViaCepService } from 'src/core/via-cep.service';
import { EnderecoService } from './adapters/endereco-service';
import { ConsultaEnderecoController } from './consulta-endereco.controller';
import { EnderecoMapper } from './endereco.mapper';

@Module({
  providers: [ViaCepService, EnderecoService, EnderecoMapper],
  controllers: [ConsultaEnderecoController],
})
export class EnderecoModule {}
