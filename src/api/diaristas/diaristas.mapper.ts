import { Injectable } from '@nestjs/common';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { DiaristaLocalidadeResponse } from './dto/create-diarista.dto';
import { DiaristaDiariaResponseDto } from './dto/diarista-diaria.dto';

@Injectable()
export class DiaristaMapper {
  toDiaristaLocalidadeResponseDto(usuario: UsuarioApi) {
    const diaristaDTO = new DiaristaLocalidadeResponse();
    diaristaDTO.nomeCompleto = usuario.nomeCompleto;
    diaristaDTO.reputacao = usuario.reputacao;
    diaristaDTO.fotoUsuario = null;
    diaristaDTO.cidade = null;
    return diaristaDTO;
  }

  toDiaristaDiariaResponseDto(usuario: UsuarioApi) {
    if (!usuario) {
      return null;
    }

    const diaristaDTO = new DiaristaDiariaResponseDto();
    diaristaDTO.id = usuario.id;
    diaristaDTO.nomeCompleto = usuario.nomeCompleto;
    diaristaDTO.reputacao = usuario.reputacao;

    if (!usuario.fotoUsuario) {
      diaristaDTO.fotoUsuario = null;
    } else {
      diaristaDTO.fotoUsuario = usuario.fotoUsuario?.url;
    }

    diaristaDTO.tipoUsuario = usuario.tipoUsuario;
    diaristaDTO.telefone = usuario.telefone;
    return diaristaDTO;
  }
}
