import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HateasOportunidade } from 'src/core/hateoas/hateoas-oportunidade';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { OportunidadesService } from './oportunidades.service';

@Controller('api/oportunidades')
export class OportunidadesController {
  constructor(
    private readonly oportunidadesService: OportunidadesService,
    private hateoas: HateasOportunidade,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  async buscarOportunidades(@GetUser() usuarioLogado: UsuarioApi) {
    const { diariaResponseDto, diarias } =
      await this.oportunidadesService.buscarOportunidades(usuarioLogado);

    for (let i = 0; i < diarias.length; i++) {
      diariaResponseDto[i].links = this.hateoas.gerarLinksHateos(diarias[i]);
    }
    return diariaResponseDto;
  }
}
