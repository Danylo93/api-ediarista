import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customAge', async: false })
export class IdadeValida implements ValidatorConstraintInterface {
  validate(nascimento: Date): boolean {
    nascimento = new Date(nascimento);
    return this.calcularIdade(nascimento) > 17 &&
      this.calcularIdade(nascimento) < 100
      ? true
      : false;
  }

  defaultMessage(): string {
    return 'A idade precisa ser entre 18 e 100 anos.';
  }

  private calcularIdade(nascimento: Date): number {
    const dataAtual = new Date(Date.now());
    const diferencaEntreDatas = Math.abs(
      dataAtual.getTime() - nascimento.getTime(),
    );
    const diferencaEmAnos = Math.floor(
      diferencaEntreDatas / (1000 * 60 * 60 * 24 * 365),
    );
    return diferencaEmAnos;
  }
}
