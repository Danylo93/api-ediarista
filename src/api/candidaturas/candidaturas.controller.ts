import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { CandidaturasService } from './candidaturas.service';

@Controller('api/diarias')
export class CandidaturasController {
  constructor(private readonly candidaturasService: CandidaturasService) {}

  @Post(':id/candidatar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.DIARISTA)
  async candidatar(
    @Param('id') id: number,
    @GetUser() usuarioLogado: UsuarioApi,
  ): Promise<{ message: string }> {
    return await this.candidaturasService.candidatar(id, usuarioLogado);
  }
}
