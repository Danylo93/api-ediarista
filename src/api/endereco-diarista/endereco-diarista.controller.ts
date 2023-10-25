import { Controller, Body, Put, UseGuards, Get, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IbgeService } from 'src/core/services/consulta-cidade/consulta-cidade.service';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { EnderecoDiaristaRequestDto } from './dto/endereco-diarista-request.dto';
import { EnderecoDiaristaService } from './endereco-diarista.service';

@Controller('api/usuarios')
export class EnderecoDiaristaController {
  constructor(
    private readonly enderecoDiaristaService: EnderecoDiaristaService,
    private consultaIbge: IbgeService,
  ) {}

  @Put('endereco')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  atualizarEndereco(
    @Body() enderecoDiarista: EnderecoDiaristaRequestDto,
    @GetUser() usuarioLogado: UsuarioApi,
  ) {
    return this.enderecoDiaristaService.atualizarEndereco(
      enderecoDiarista,
      usuarioLogado,
    );
  }

  @Get('endereco')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  exibirEndereco(@GetUser() usuarioLogado: UsuarioApi) {
    return this.enderecoDiaristaService.exibirEndereco(usuarioLogado);
  }

  @Get('endereco/ibge/:codigoIbge')
  consultaCidadeIbge(@Param('codigoIbge') codigoIbge: string) {
    return this.consultaIbge.busucarCidadePorCodigoIbge(codigoIbge);
  }
}
