import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HateoasUsuario } from 'src/core/hateoas/hateoas-usuario';
import { UsuarioResponseDto } from '../usuarios/dto/usuario-response.dto';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { UsuarioMapper } from '../usuarios/usuarios.mapper';

@Controller('api/me')
export class MeController {
  constructor(
    private usuarioMapper: UsuarioMapper,
    private hateoas: HateoasUsuario,
  ) {}
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async me(@GetUser() usuario: UsuarioApi): Promise<UsuarioResponseDto> {
    const usuarioLogado = this.usuarioMapper.toUsuarioResponseDto(usuario);
    usuarioLogado.links = this.hateoas.gerarLinksHateos(usuario.tipoUsuario);
    return usuarioLogado;
  }
}