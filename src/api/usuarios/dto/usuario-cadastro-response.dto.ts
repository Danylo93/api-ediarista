import { ITokens } from 'src/auth/strategies/jwt-tokens.interface';
import { UsuarioResponseDto } from './usuario-response.dto';

export class UsuarioCadastroResponseDto extends UsuarioResponseDto {
  token: ITokens;
}
