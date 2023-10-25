import { BadRequestException } from '@nestjs/common';
import { UsuarioRequestDto } from 'src/api/usuarios/dto/usuario-request.dto';
import TipoUsuario from 'src/api/usuarios/enum/tipo-usuario.enum';

export class ValidatorUsuarioPix {
  validarUsuarioPix(usuarioDto: UsuarioRequestDto) {
    if (usuarioDto.tipoUsuario == TipoUsuario.DIARISTA) {
      if (!usuarioDto.chavePix) {
        throw new BadRequestException(
          'Para usuário do tipo Diarista a Chave Pix é obrigatória',
        );
      }
      return usuarioDto.chavePix;
    }
    return null;
  }
}
