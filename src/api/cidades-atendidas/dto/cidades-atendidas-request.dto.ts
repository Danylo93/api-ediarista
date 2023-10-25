import { IsNotEmpty } from 'class-validator';
import { CidadeAtendidaRequestDto } from './cidade-atendida-request.dto';

export class CidadesAtendidasRequestDto {
  @IsNotEmpty()
  cidades: CidadeAtendidaRequestDto[];
}
