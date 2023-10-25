import { Module } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { ServicosController } from './servicos.controller';
import { ServicoMapper } from './servicos.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servico } from './entities/servico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servico])],
  controllers: [ServicosController],
  providers: [ServicosService, ServicoMapper],
})
export class ServicosModule {}