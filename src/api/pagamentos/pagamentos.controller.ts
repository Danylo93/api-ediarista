import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { PagamentoRequestDto } from './dto/pagamento-request.dto';
import { PagamentosService } from './pagamentos.service';

@Controller('api')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.CLIENTE)
  @Post('diarias/:id/pagar')
  pagar(
    @Body() pagamentoDto: PagamentoRequestDto,
    @Param('id') id: number,
    @GetUser() usuarioLogado: UsuarioApi,
  ) {
    return this.pagamentosService.pagar(pagamentoDto, id, usuarioLogado);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  @Get('pagamentos')
  async listarPagamentos(@GetUser() usuarioLogado: UsuarioApi) {
    return await this.pagamentosService.listarPagamentoPorUsuarioLogado(
      usuarioLogado,
    );
  }
}