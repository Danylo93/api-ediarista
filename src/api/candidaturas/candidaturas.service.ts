import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidatorCandidatura } from 'src/core/validators/candidatura/validator-candidatura';
import { DiariaRepository } from '../diarias/diarias.repository';
import { UsuarioApi } from '../usuarios/entities/usuario.entity';

@Injectable()
export class CandidaturasService {
  constructor(
    private diariaRepository: DiariaRepository,
    private candidaturaValidator: ValidatorCandidatura,
  ) {}
  async candidatar(id: number, usuarioLogado: UsuarioApi) {
    const diaria = await this.buscarDiariaPorId(id);
    if (!diaria.candidatos) {
      diaria.candidatos = [];
    }
    await this.candidaturaValidator.validar(usuarioLogado, diaria);

    diaria.candidatos.push(usuarioLogado);
    await this.diariaRepository.repository.save(diaria);
    return { message: 'Candidatura realizada com sucesso' };
  }

  private async buscarDiariaPorId(id: number) {
    const diaria = await this.diariaRepository.repository.findOneBy({ id: id });
    if (!diaria) {
      throw new NotFoundException(`Diária de ID: ${id} não enconttrada`);
    }
    return diaria;
  }
}
