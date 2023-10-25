import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  Inject,
  forwardRef,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuarioRequestDto } from './dto/usuario-request.dto';
import multerConfig from './multer-config';
import { UsuariosService } from './usuarios.service';
import { Request } from 'express';
import { HateoasUsuario } from 'src/core/hateoas/hateoas-usuario';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UsuarioApi } from './entities/usuario.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import multerConfigProfile from './multer-config-profile';
import { UsuarioAtualizarRequestDto } from './dto/usuario-atualizar-request.dto';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    @Inject(forwardRef(() => HateoasUsuario))
    private hateOas: HateoasUsuario,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto_documento', multerConfig))
  async cadastrar(
    @Body() usuarioRequestDto: UsuarioRequestDto,
    @UploadedFile() file: Express.MulterS3.File,
    @Req() req: Request,
  ) {
    const usuarioCadastrado = await this.usuariosService.cadastrar(
      usuarioRequestDto,
      file,
      req,
    );

    usuarioCadastrado.links = this.hateOas.gerarLinksHateos(
      usuarioRequestDto.tipoUsuario,
    );

    return usuarioCadastrado;
  }

  @Post('foto')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('foto_usuario', multerConfigProfile))
  async atualizarFotoUsuario(
    @GetUser() usuarioLogado: UsuarioApi,
    @UploadedFile() file: Express.MulterS3.File,
    @Req() req: Request,
  ) {
    return await this.usuariosService.atualizarFotoUsuario(
      file,
      usuarioLogado,
      req,
    );
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async atualizar(
    @GetUser() usuarioLogado,
    @Body() request: UsuarioAtualizarRequestDto,
  ) {
    return this.usuariosService.atualizar(request, usuarioLogado);
  }
}
