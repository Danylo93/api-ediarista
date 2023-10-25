import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'dataAtendimentoInicio', async: false })
@Injectable()
export class DataAtendimentoInicio implements ValidatorConstraintInterface {
  validate(dataAtendimento: Date, horaInicio: ValidationArguments): boolean {
    const horaDataAtendimento = new Date(dataAtendimento).getHours();
    return horaDataAtendimento >= horaInicio.constraints[0] ? true : false;
  }

  defaultMessage(horaInicio: ValidationArguments): string {
    return `Diária deve iniciar a partir das ${horaInicio.constraints[0]}AM`;
  }
}
