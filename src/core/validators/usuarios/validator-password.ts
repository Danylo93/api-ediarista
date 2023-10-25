import { BadRequestException } from '@nestjs/common';

export class ValidatorPasswordConfirmation {
  validarConfirmacaoDeSenha(senha: string, confirmacaoSenha: string) {
    if (senha !== confirmacaoSenha) {
      throw new BadRequestException('Senha não confere');
    }
  }
}
