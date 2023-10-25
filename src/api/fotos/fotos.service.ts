import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Foto } from './entities/foto.entity';

@Injectable()
export class FotosService {
  constructor(
    @InjectRepository(Foto)
    private fotoRepository: Repository<Foto>,
  ) {}

  async salvar(file: Express.MulterS3.File, req: Request): Promise<Foto> {
    const foto = new Foto();
    foto.fileName = file.key;
    foto.contentLength = file.size;
    foto.contentType = file.mimetype;
    foto.url = file.location;

    return await this.fotoRepository.save(foto);
  }

  async deletar(id: number) {
    return await this.fotoRepository.delete({ id: id });
  }
}
