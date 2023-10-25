import { Module } from '@nestjs/common';
import { FotosService } from './fotos.service';
import { FotosController } from './fotos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foto } from './entities/foto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foto])],
  controllers: [FotosController],
  providers: [FotosService],
})
export class FotosModule {}
