import { Injectable } from '@nestjs/common';
import {
  validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsuarioRepository } from 'src/api/usuarios/usuarios.repository';

@ValidatorConstraint({ name: 'ChavePixJaExiste', async: true })
@Injectable()
export class ChavePixJaExiste implements ValidatorConstraintInterface {
  constructor(private usuarioRepository: UsuarioRepository) {}
  async validate(chavePix: string): Promise<boolean> {
    if (chavePix === '' || null) {
      return true;
    }
    const existePix = await this.usuarioRepository.repository.findOneBy({
      chavePix: chavePix,
    });

    return !existePix ? true : false;
  }

  defaultMessage(): string {
    return 'Chave Pix Já cadastrada.';
  }
}
