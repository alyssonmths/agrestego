import { Injectable, ConflictException } from '@nestjs/common';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';
import { MotoristaService } from 'src/motorista/motorista.service';

@Injectable()
export class PassageiroService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly motoristaService: MotoristaService,
  ) { }

  async create(request: CreatePassageiroDto) {
    // Verificar se o email já existe como passageiro
    const existingPassageiro = await this.findOne(request.email);
    if (existingPassageiro) {
      throw new ConflictException('Email já cadastrado');
    }

    // Verificar se o email já existe como motorista
    const existingMotorista = await this.motoristaService.findOne(request.email);
    if (existingMotorista) {
      throw new ConflictException('Email já cadastrado');
    }

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
