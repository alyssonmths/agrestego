import { Injectable } from '@nestjs/common';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PassageiroService {

  constructor(private readonly prisma: PrismaService) { }

  create(createPassageiroDto: CreatePassageiroDto) {
    return this.prisma.passageiro.create({
      data: createPassageiroDto,
    });
  }

  findAll() {
    return this.prisma.passageiro.findMany();
  }

  findOne(id: number) {
    return this.prisma.passageiro.findUnique({ where: { id } });
  }

  update(id: number, updatePassageiroDto: UpdatePassageiroDto) {
    return this.prisma.passageiro.update({ where: { id }, data: updatePassageiroDto });
  }

  remove(id: number) {
    return this.prisma.passageiro.delete({ where: { id } });
  }
}
