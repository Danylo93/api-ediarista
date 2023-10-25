import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidatorConfirmacaoDiaria } from 'src/core/validators/confirmacao-diaria/validator-confirmacao-diaria';
import { DiariaRepository } from '../diarias/diarias.repository';
import { Diaria } from '../diarias/entities/diaria.entity';
import { ConfirmacaoPresencaController } from './confirmacao-presenca.controller';
import { ConfirmacaoPresencaService } from './confirmacao-presenca.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diaria])],
  controllers: [ConfirmacaoPresencaController],
  providers: [
    DiariaRepository,
    ConfirmacaoPresencaService,
    ValidatorConfirmacaoDiaria,
  ],
})
export class ConfirmacaoPresencaModule {}
