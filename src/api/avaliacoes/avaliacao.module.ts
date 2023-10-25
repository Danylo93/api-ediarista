import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NovaAvaliacaoEvents } from 'src/core/events/nova-avaliacao.events';
import { AvaliacaoValidator } from 'src/core/validators/avaliacao/validator-avaliacao';
import { DiariaRepository } from '../diarias/diarias.repository';
import { Diaria } from '../diarias/entities/diaria.entity';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioRepository } from '../usuarios/usuarios.repository';
import { AvaliacaoController } from './avaliacao.controller';
import { AvaliacaoMapper } from './avaliacao.mapper';
import { AvaliacaoRepository } from './avaliacao.repository';
import { AvaliacaoService } from './avaliacao.service';
import { Avaliacao } from './entities/avaliacao.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diaria, Avaliacao, UsuarioApi])],
  controllers: [AvaliacaoController],
  providers: [
    DiariaRepository,
    AvaliacaoRepository,
    UsuarioRepository,
    AvaliacaoService,
    AvaliacaoMapper,
    AvaliacaoValidator,
    NovaAvaliacaoEvents,
  ],
})
export class AvaliacaoModule {}
