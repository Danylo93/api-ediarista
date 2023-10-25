import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';

@Injectable()
export class ValidatorPagamento {
  validarStatus(diaria: Diaria) {
    if (diaria.status !== DiariaStatus.SEM_PAGAMENTO) {
      throw new BadRequestException(
        'Diária deve estar com o status sem pagamento',
      );
    }
  }

  validarClienteDiaria(usuarioLogado: UsuarioApi, diaria: Diaria) {
    if (usuarioLogado.id !== diaria.cliente.id) {
      throw new ForbiddenException('Acesso Negado');
    }
  }
}
