import { Injectable } from '@nestjs/common';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PassageiroService {

  constructor(private readonly prisma: PrismaService) { }

  create(createPassageiroDto: CreatePassageiroDto) {
    return this.prisma.passageiro.create({
      data: createPassageiroDto,
    });
  }

  findOne(email: string): Promise<any> {
    return this.prisma.passageiro.findUnique({ where: { email } });
  }
}
