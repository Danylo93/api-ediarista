import { PartialType } from '@nestjs/mapped-types';
import { CreateFotoDto } from './create-foto.dto';

export class UpdateFotoDto extends PartialType(CreateFotoDto) {}
