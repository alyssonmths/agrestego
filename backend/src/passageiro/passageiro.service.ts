import { Injectable } from '@nestjs/common';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';

@Injectable()
export class PassageiroService {

  constructor(private readonly prisma: PrismaService) { }

  async create(request: CreatePassageiroDto) {
    return await this.prisma.passageiro.create({
      data: request,
    });
  }

  async findOne(email: string): Promise<any> {
    return await this.prisma.passageiro.findUnique({ where: { email } });
  }

  async update(id: number, request: UpdatePassageiroDto) {
    return await this.prisma.passageiro.update({
      data: request,
      where: { id }
    });
  }
}
