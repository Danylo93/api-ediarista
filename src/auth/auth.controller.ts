import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuarioAuthDto } from './dtos/usuario-auth.dto';
import { ITokens } from './strategies/jwt-tokens.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('token')
  autenticar(@Body() usuarioAuthDto: UsuarioAuthDto): Promise<ITokens> {
    return this.authService.signIn(usuarioAuthDto);
  }

  @Post('refresh')
  reautenticar(@Request() req) {
    return this.authService.reautenticar(req);
  }

  @Post('logout')
  logOut(@Request() req) {
    return this.authService.logout(req);
  }
}
