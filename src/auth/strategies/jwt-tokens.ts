import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsuarioRepository } from 'src/api/usuarios/usuarios.repository';
import { TokensService } from '../tokens/tokens.service';
import { JwtPayload } from './jwt-payload.interface';
import { ITokens } from './jwt-tokens.interface';

@Injectable()
export class JwtTokens {
  constructor(
    private jwtService: JwtService,
    private usuarioRepository: UsuarioRepository,
    private tokenService: TokensService,
  ) {}

  async gerarTokens(payload: JwtPayload): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: 'tw-access',
        expiresIn: 50000,
      }),
      this.jwtService.signAsync(payload, {
        secret: 'tw-refresh',
        expiresIn: 120,
      }),
    ]);
    return { access: accessToken, refresh: refreshToken };
  }

  async verificarRefreshToken(req: Request) {
    const refreshToken = req.body.refresh;

    const email = this.jwtService.decode(refreshToken)['email'];
    const usuario = await this.usuarioRepository.repository.findOneBy({
      email: email,
    });

    if (!usuario) {
      throw new UnauthorizedException();
    }

    const tokenExist = await this.tokenService.findOne(refreshToken);
    if (!tokenExist) {
      await this.tokenService.create(refreshToken);
    } else {
      throw new UnauthorizedException('Token Inválido');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: 'tw-refresh',
      });
      return email;
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Assinatura Inválida');
      }
      if (err.name === 'TokenexpiredErron') {
        throw new UnauthorizedException('Token Expirado');
      }
      throw new UnauthorizedException(err.name);
    }
  }

  async desativarToken(refreshToken: string) {
    const tokenExist = await this.tokenService.findOne(refreshToken);
    if (!tokenExist) {
      await this.tokenService.create(refreshToken);
      throw new HttpException('Reset Content', HttpStatus.RESET_CONTENT);
    } else {
      throw new UnauthorizedException('Token Inválido');
    }
  }
}
