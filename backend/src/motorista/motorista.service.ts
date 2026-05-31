import { Injectable } from '@nestjs/common';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class MotoristaService {
  constructor(private readonly prisma: PrismaService) { }

 async create(createMotoristaDto: CreateMotoristaDto) {
    return await this.prisma.motorista.create({
      data: createMotoristaDto,
    });
  }

  async findOne(email: string) {
    return await this.prisma.motorista.findUnique({ where: { email } });
  }

  async update( id: number, request: UpdateMotoristaDto) {
    return await this.prisma.motorista.update({
      data: request,
      where: { id } 
    })
  }
}