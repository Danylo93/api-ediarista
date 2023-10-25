import { ForbiddenException } from '@nestjs/common';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import TipoUsuario from 'src/api/usuarios/enum/tipo-usuario.enum';

export class ValidatorDiariaUsuario {
  validarDiariaUsuario(usuarioLogado: UsuarioApi, diaria: Diaria) {
    if (usuarioLogado.tipoUsuario === TipoUsuario.CLIENTE) {
      if (!diaria.cliente) {
        throw new ForbiddenException('Acesso negado');
      }
      if (usuarioLogado.id === diaria.cliente.id) {
        return diaria;
      }
    }

    if (usuarioLogado.tipoUsuario === TipoUsuario.DIARISTA) {
      if (!diaria.diarista) {
        throw new ForbiddenException('Acesso negado');
      }
      if (usuarioLogado.id === diaria.diarista.id) {
        return diaria;
      }
    }

    throw new ForbiddenException('Acesso negado');
  }
}
