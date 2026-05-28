import { PartialType } from '@nestjs/mapped-types';
import { CreateCorridaDto } from './create-corrida.dto';

export class UpdateCorridaDto extends PartialType(CreateCorridaDto) {}
