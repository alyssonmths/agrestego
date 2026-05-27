import { PartialType } from '@nestjs/mapped-types';
import { CreatePassageiroDto } from './create-passageiro.dto';

export class UpdatePassageiroDto extends PartialType(CreatePassageiroDto) {}
