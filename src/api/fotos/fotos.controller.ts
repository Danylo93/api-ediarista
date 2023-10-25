import { Controller } from '@nestjs/common';
import { FotosService } from './fotos.service';

@Controller('fotos')
export class FotosController {
  constructor(private readonly fotosService: FotosService) {}
}
