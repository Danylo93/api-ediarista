import { Module } from '@nestjs/common';
import { EnderecoDiaristaService } from './endereco-diarista.service';
import { EnderecoDiaristaController } from './endereco-diarista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnderecoDiarista } from './entities/endereco-diarista.entity';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioRepository } from '../usuarios/usuarios.repository';
import { EnderecoDiaristaMapper } from './endereco-diarista.mapper';
import { IbgeService } from 'src/core/services/consulta-cidade/consulta-cidade.service';

@Module({
  imports: [TypeOrmModule.forFeature([EnderecoDiarista, UsuarioApi])],
  controllers: [EnderecoDiaristaController],
  providers: [
    EnderecoDiaristaService,
    EnderecoDiaristaMapper,
    UsuarioRepository,
    IbgeService,
  ],
})
export class EnderecoDiaristaModule {}
