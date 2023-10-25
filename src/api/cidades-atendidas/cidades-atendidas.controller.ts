import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { CidadesAtendidasService } from './cidades-atendidas.service';
import { CidadeAtendidaResponseDto } from './dto/cidade-atendida-response.dto';
import { CidadesAtendidasRequestDto } from './dto/cidades-atendidas-request.dto';

@Controller('api/usuarios')
export class CidadesAtendidasController {
  constructor(private cidadesService: CidadesAtendidasService) {}

  @Get('cidades-atendidas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  listarCidadesAtendidas(
    @GetUser() usuarioLogado: UsuarioApi,
  ): CidadeAtendidaResponseDto[] {
    return this.cidadesService.listarCidadesAtendidas(usuarioLogado);
  }

  @Put('cidades-atendidas')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  atualizarCidadesAtendidas(
    @GetUser() usuarioLogado: UsuarioApi,
    @Body() request: CidadesAtendidasRequestDto,
  ): Promise<{ message: string }> {
    return this.cidadesService.atualizarCidadesAtendidas(
      request,
      usuarioLogado,
    );
  }
}
