import { Module } from '@nestjs/common';
import { HateoasUsuario } from 'src/core/hateoas/hateoas-usuario';
import { UsuarioMapper } from '../usuarios/usuarios.mapper';
import { MeController } from './me.controller';

@Module({
  controllers: [MeController],
  providers: [UsuarioMapper, HateoasUsuario],
})
export class MeModule {}
