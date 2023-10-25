import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HateoasDiaria } from 'src/core/hateoas/hateoas-diaria';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { DiariasService } from './diarias.service';
import { DiariaCancelamentoRequestDto } from './dto/diaria-cancelamento-request.dto';
import { DiariaRequestDto } from './dto/diaria-request.dto';

@Controller('api/diarias')
export class DiariasController {
  constructor(
    private diariasService: DiariasService,
    private hateoas: HateoasDiaria,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.CLIENTE)
  async cadastrar(
    @Body() diariaRequestDto: DiariaRequestDto,
    @GetUser() usuarioLogado: UsuarioApi,
  ) {
    const { diariaDto, diaria } = await this.diariasService.cadastrar(
      diariaRequestDto,
      usuarioLogado,
    );

    diariaDto.links = this.hateoas.gerarLinksHateos(
      usuarioLogado.tipoUsuario,
      diaria,
    );

    return diariaDto;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async listarDiarias(@GetUser() usuarioLogado: UsuarioApi) {
    return await this.diariasService.listarPorUsuarioLogado(usuarioLogado);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async buscarPorId(
    @GetUser() usuarioLogado: UsuarioApi,
    @Param('id') id: number,
  ) {
    const { diariaDto, diaria } = await this.diariasService.buscarPorId(
      id,
      usuarioLogado,
    );

    diariaDto.links = this.hateoas.gerarLinksHateos(
      usuarioLogado.tipoUsuario,
      diaria,
    );

    return diariaDto;
  }

  @Patch(':id/cancelar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  cancelar(
    @Body() diariaCancelamentoRequestDto: DiariaCancelamentoRequestDto,
    @GetUser() usuarioLogado: UsuarioApi,
    @Param('id') id: number,
  ) {
    return this.diariasService.cancelar(
      id,
      diariaCancelamentoRequestDto,
      usuarioLogado,
    );
  }
}