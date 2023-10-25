import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): UsuarioApi => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
