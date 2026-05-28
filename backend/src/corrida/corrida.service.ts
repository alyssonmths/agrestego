import { Injectable } from '@nestjs/common';
import { CreateCorridaDto } from './dto/create-corrida.dto';
import { UpdateCorridaDto } from './dto/update-corrida.dto';

@Injectable()
export class CorridaService {
  create(createCorridaDto: CreateCorridaDto) {
    return 'This action adds a new corrida';
  }

  findAll() {
    return `This action returns all corrida`;
  }

  findOne(id: number) {
    return `This action returns a #${id} corrida`;
  }

  update(id: number, updateCorridaDto: UpdateCorridaDto) {
    return `This action updates a #${id} corrida`;
  }

  remove(id: number) {
    return `This action removes a #${id} corrida`;
  }
}
