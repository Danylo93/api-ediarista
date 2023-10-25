import { Injectable } from '@nestjs/common';
import { ValidatorConfirmacaoDiaria } from 'src/core/validators/confirmacao-diaria/validator-confirmacao-diaria';
import { DiariaRepository } from '../diarias/diarias.repository';
import DiariaStatus from '../diarias/enum/diaria-status.enum';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';

@Injectable()
export class ConfirmacaoPresencaService {
  constructor(
    private diariaRepository: DiariaRepository,
    private validator: ValidatorConfirmacaoDiaria,
  ) {}

  async confirmacaoPresenca(
    id: number,
    usuario: UsuarioApi,
  ): Promise<{ message: string }> {
    const diaria = await this.buscarDiariaPorId(id);
    this.validator.validarDonoDaDiaria(usuario.id, diaria.cliente.id);
    this.validator.validarStatusConfirmado(diaria);
    this.validator.validarDataPassadoDiaria(diaria);
    this.validator.validarDiariaDiarista(diaria);

    diaria.status = DiariaStatus.CONCLUIDO;
    await this.diariaRepository.repository.save(diaria);
    return { message: 'Presença confirmada com sucesso' };
  }

  private async buscarDiariaPorId(id: number) {
    const diaria = await this.diariaRepository.repository.findOneBy({ id: id });
    if (!diaria) {
      throw new Error(`Diária de id: ${id} não encontrada`);
    }
    return diaria;
  }
}
