import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { ConfirmacaoPresencaService } from './confirmacao-presenca.service';

@Controller('api/diarias/:id/confirmar-presenca')
export class ConfirmacaoPresencaController {
  constructor(private confirmacaoPresencaService: ConfirmacaoPresencaService) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(TipoUsuario.CLIENTE)
  confirmacaoPresenca(
    @Param('id') id: number,
    @GetUser() usuarioLogado: UsuarioApi,
  ) {
    return this.confirmacaoPresencaService.confirmacaoPresenca(
      id,
      usuarioLogado,
    );
  }
}
