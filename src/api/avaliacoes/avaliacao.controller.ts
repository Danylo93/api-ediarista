import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import { AvaliacaoService } from './avaliacao.service';
import { AvaliacaoRequestDto } from './dto/avaliacao-request.dto';

@Controller('api/diarias/:id/avaliacao')
export class AvaliacaoController {
  constructor(private avaliacaoService: AvaliacaoService) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  avaliarDiaria(
    @Body() avaliacaoRequestDto: AvaliacaoRequestDto,
    @GetUser() usuarioLogado: UsuarioApi,
    @Param('id') id: number,
  ) {
    return this.avaliacaoService.avaliarDiaria(
      avaliacaoRequestDto,
      id,
      usuarioLogado,
    );
  }
}
