import { BadRequestException, Injectable } from '@nestjs/common';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';

@Injectable()
export class ValidatorCandidatura {
  async validar(usuario: UsuarioApi, diaria?: Diaria) {
    this.validarEnderecoCandidato(usuario);
    this.validarDuplicidadeCandidato(diaria, usuario);
    this.validarQuantidadeCandidatos(diaria);
    this.validarStatusDiaria(diaria);
    this.validarDataAtendimento(diaria);
    this.validarDiaristaDiaria(diaria);
  }

  private validarEnderecoCandidato(usuario: UsuarioApi) {
    if (!usuario.endereco) {
      const message = {
        candidatos: 'Diarista deve ter o endereço cadastrado',
      };
      throw new BadRequestException(message);
    }
  }

  private validarDuplicidadeCandidato(diaria: Diaria, usuario: UsuarioApi) {
    const candidatos = diaria.candidatos;

    if (candidatos.find((user) => user.id === usuario.id)) {
      const message = {
        candidatos: 'Diarista já se candidatou para essa diária',
      };
      throw new BadRequestException(message);
    }
  }

  private validarQuantidadeCandidatos(diaria: Diaria) {
    const candidatos = diaria.candidatos;

    if (candidatos.length >= 3) {
      const message = {
        candidatos: 'Diária já possui número máximo de canditados',
      };
      throw new BadRequestException(message);
    }
  }

  private validarStatusDiaria(diaria: Diaria) {
    if (diaria.status != DiariaStatus.PAGO) {
      const message = {
        status: 'Diária não está com status pago',
      };
      throw new BadRequestException(message);
    }
  }

  private validarDataAtendimento(diaria: Diaria) {
    const dataAtual = new Date(Date.now());
    if (diaria.dataAtendimento < dataAtual) {
      const message = {
        data_atendimento: 'Data de atendimento expirada',
      };
      throw new BadRequestException(message);
    }
  }

  validarDiaristaDiaria(diaria: Diaria) {
    if (diaria.diarista) {
      const message = {
        diarista: 'Diária já possui um diarista',
      };
      throw new BadRequestException(message);
    }
  }
}
