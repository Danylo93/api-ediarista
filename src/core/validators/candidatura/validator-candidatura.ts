import { BadRequestException, Injectable } from '@nestjs/common';
import { Diaria } from 'src/api/diarias/entities/diaria.entity';
import DiariaStatus from 'src/api/diarias/enum/diaria-status.enum';
import { UsuarioApi } from 'src/api/usuarios/entities/usuario.entity';

@Injectable()
export class ValidatorCandidatura {
  async validar(usuarioLogado: UsuarioApi, diaria: Diaria) {
    this.validarEnderecoCandidato(usuarioLogado);
    this.validarDuplicidadeCandidato(diaria, usuarioLogado);
    this.quantidadeCandidatos(diaria);
    this.validarStatusDiaria(diaria);
    this.validarDataAtendimento(diaria);
    this.validarDiaristaDiaria(diaria);
  }
  private validarDiaristaDiaria(diaria: Diaria) {
    if (diaria.diarista) {
      throw new BadRequestException('Diária já possui um(a) diarista');
    }
  }

  private validarDataAtendimento(diaria: Diaria) {
    const dataAtual = new Date(Date.now());

    if (diaria.dataAtendimento < dataAtual) {
      throw new BadRequestException('Data de atendimento Expirada');
    }
  }

  private validarStatusDiaria(diaria: Diaria) {
    if (diaria.status != DiariaStatus.PAGO) {
      throw new BadRequestException('Diára não está com status pago');
    }
  }

  private quantidadeCandidatos(diaria: Diaria) {
    const candidatos = diaria.candidatos;
    const maximoCandidatos = 3;

    if (candidatos.length >= maximoCandidatos) {
      throw new BadRequestException('Diária possui número máximo de canidatos');
    }
  }

  private validarDuplicidadeCandidato(
    diaria: Diaria,
    usuarioLogado: UsuarioApi,
  ) {
    const candidatos = diaria.candidatos;

    if (candidatos.find((user) => user.id === usuarioLogado.id)) {
      throw new BadRequestException(
        'Diarista já se candidatou para essa diária',
      );
    }
  }

  private validarEnderecoCandidato(usuarioLogado: UsuarioApi) {
    if (!usuarioLogado.endereco) {
      throw new BadRequestException('Diarista deve ter o endereço cadastrado');
    }
  }
}
