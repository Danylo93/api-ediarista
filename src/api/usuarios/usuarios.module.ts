import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioApi } from './entities/usuario.entity';
import { UsuarioMapper } from './usuarios.mapper';
import { UsuarioRepository } from './usuarios.repository';
import { EmailJaExiste } from 'src/core/validators/usuarios/validator-email';
import { CpfJaExiste } from 'src/core/validators/usuarios/validator-cpf';
import { ValidatorPasswordConfirmation } from 'src/core/validators/usuarios/validator-password';
import { ChavePixJaExiste } from 'src/core/validators/usuarios/validator-pix';
import { ValidatorUsuarioPix } from 'src/core/validators/usuarios/validator-usuario-pix';
import { Foto } from '../fotos/entities/foto.entity';
import { FotosService } from '../fotos/fotos.service';
import { MailModule } from 'src/core/services/mail/mail.module';
import { JwtTokens } from 'src/auth/strategies/jwt-tokens';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TokensService } from 'src/auth/tokens/tokens.service';
import { AuthService } from 'src/auth/auth.service';
import { Token } from 'src/auth/tokens/entities/token.entity';
import { HateoasUsuario } from 'src/core/hateoas/hateoas-usuario';
import { HateosIndex } from 'src/core/hateoas/hateoas-index';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioApi, Foto, Token]),
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    UsuarioMapper,
    UsuarioRepository,
    EmailJaExiste,
    CpfJaExiste,
    ValidatorPasswordConfirmation,
    ChavePixJaExiste,
    ValidatorUsuarioPix,
    FotosService,
    JwtTokens,
    TokensService,
    HateoasUsuario,
  ],
})
export class UsuariosModule {}