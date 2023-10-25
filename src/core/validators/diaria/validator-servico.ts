import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Servico } from 'src/api/servicos/entities/servico.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ name: 'ServicoExiste', async: true })
@Injectable()
export class ServicoExiste implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Servico)
    private servicoRepository: Repository<Servico>,
  ) {}

  async validate(servico: number): Promise<boolean> {
    const existeServico = await this.servicoRepository.findOneBy({
      id: servico,
    });
    return existeServico ? true : false;
  }

  defaultMessage(): string {
    return 'Serviço com ID inválido';
  }
}
