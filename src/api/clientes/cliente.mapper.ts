import { Injectable } from '@nestjs/common';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { ClienteResponseDto } from './dto/cliente-response.dto';

@Injectable()
export class ClienteMapper {
  toResponse(usuario: UsuarioApi): ClienteResponseDto {
    const clienteDto = new ClienteResponseDto();

    clienteDto.id = usuario.id;
    clienteDto.nascimento = usuario.nascimento;
    clienteDto.nomeCompleto = usuario.nomeCompleto;
    clienteDto.reputacao = usuario.reputacao;
    clienteDto.telefone = usuario.telefone;
    clienteDto.tipoUsuario = usuario.tipoUsuario;

    if (!usuario.fotoUsuario) {
      clienteDto.fotoUsuario = null;
    } else {
      clienteDto.fotoUsuario = usuario.fotoUsuario?.url;
    }

    return clienteDto;
  }
}
