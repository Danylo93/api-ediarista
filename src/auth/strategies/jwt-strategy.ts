import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsuarioResponseDto } from 'src/api/usuarios/dto/usuario-response.dto';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';
import { UsuarioMapper } from 'src/api/usuarios/usuarios.mapper';
import { UsuarioRepository } from 'src/api/usuarios/usuarios.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private mapper: UsuarioMapper,
  ) {
    super({
      secretOrKey: 'tw-access',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<UsuarioApi> {
    const { email } = payload;
    const usuario = await this.usuarioRepository.repository.findOneBy({
      email: email,
    });

    if (!usuario) {
      throw new UnauthorizedException();
    }

    return usuario;
  }
}
