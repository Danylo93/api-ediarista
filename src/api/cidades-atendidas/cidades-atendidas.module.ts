import { Module } from '@nestjs/common';
import { CidadesAtendidasService } from './cidades-atendidas.service';
import { CidadesAtendidasController } from './cidades-atendidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CidadesAtendidas } from './entities/cidades-atendida.entity';
import { IbgeService } from 'src/core/services/consulta-cidade/consulta-cidade.service';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioRepository } from '../usuarios/usuarios.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CidadesAtendidas, UsuarioApi])],
  controllers: [CidadesAtendidasController],
  providers: [CidadesAtendidasService, IbgeService, UsuarioRepository],
})
export class CidadesAtendidasModule {}
