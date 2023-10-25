import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsuarioRepository } from 'src/api/usuarios/usuarios.repository';

@ValidatorConstraint({ name: 'CpfJaExiste', async: true })
@Injectable()
export class CpfJaExiste implements ValidatorConstraintInterface {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async validate(cpf: string): Promise<boolean> {
    const existeCpf = await this.usuarioRepository.repository.findOneBy({
      cpf: cpf,
    });
    return !existeCpf ? true : false;
  }

  defaultMessage(): string {
    return 'CPF já cadastrado';
  }
}
