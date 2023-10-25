import { Module } from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service';
import { CandidaturasController } from './candidaturas.controller';
import { DiariaRepository } from '../diarias/diarias.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diaria } from '../diarias/entities/diaria.entity';
import { ValidatorCandidatura } from 'src/core/validators/candidatura/validator-candidatura';

@Module({
  imports: [TypeOrmModule.forFeature([Diaria])],
  controllers: [CandidaturasController],
  providers: [CandidaturasService, DiariaRepository, ValidatorCandidatura],
})
export class CandidaturasModule {}
