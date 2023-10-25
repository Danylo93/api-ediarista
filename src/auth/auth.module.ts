import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import { JwtStrategy } from './strategies/jwt-strategy';
import { JwtTokens } from './strategies/jwt-tokens';
import { UsuarioRepository } from 'src/api/usuarios/usuarios.repository';
import { UsuarioMapper } from 'src/api/usuarios/usuarios.mapper';
import { TokensService } from './tokens/tokens.service';
import { Token } from './tokens/entities/token.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UsuarioApi, Token]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtTokens,
    UsuarioRepository,
    UsuarioMapper,
    TokensService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
