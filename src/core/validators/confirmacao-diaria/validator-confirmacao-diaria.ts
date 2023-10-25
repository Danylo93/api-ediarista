import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';

export class ValidatorConfirmacaoDiaria {
  validarStatusConfirmado(diaria: Diaria) {
    if (diaria.status !== DiariaStatus.CONFIRMADO) {
      throw new BadRequestException(
        'Diária precisa estar com status Confirmado',
      );
    }
  }

  validarDonoDaDiaria(idCliente: number, idClienteDiaria: number) {
    if (idCliente !== idClienteDiaria) {
      throw new ForbiddenException('Acesso Negado');
    }
  }

  validarDataPassadoDiaria(diaria: Diaria) {
    const hoje = new Date(Date.now());
    const dataAtendimentoDiaria = diaria.dataAtendimento;

    if (hoje < dataAtendimentoDiaria) {
      throw new BadRequestException(
        'Data de atendimento deve estar no passado',
      );
    }
  }

  validarDiariaDiarista(diaria: Diaria) {
    if (!diaria.diarista) {
      throw new BadRequestException('Diária não possui diarista selecionado');
    }
  }
}
