import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';
import TipoUsuario from '../usuarios/enum/tipo-usuario.enum';
import { ServicosService } from './servicos.service';

@Controller('api/servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Get()
  findAll(@GetUser() user: UsuarioApi) {
    return this.servicosService.findAll();
  }
}
