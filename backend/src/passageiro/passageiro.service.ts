import { Injectable } from '@nestjs/common';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
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

  async createEndereco(userId: number, request: CreateEnderecoDto) {
    return await this.prisma.endereco.create({
      data: {
        ...request,
        passageiro: {
          connect: { id: userId },
        },
      },
    });
  }

  async listEnderecos(userId: number) {
    return await this.prisma.endereco.findMany({
      where: { passageiroId: userId },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async deleteEndereco(userId: number, enderecoId: number) {
    const endereco = await this.prisma.endereco.findUnique({ where: { id: enderecoId } });
    if (!endereco || endereco.passageiroId !== userId) {
      throw new Error('Endereço não encontrado ou sem permissão');
    }

    return await this.prisma.endereco.delete({ where: { id: enderecoId } });
  }

  async findOne(email: string): Promise<any> {
    return await this.prisma.passageiro.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<any> {
    return await this.prisma.passageiro.findUnique({ where: { id } });
  }
  async update(id: number, request: UpdatePassageiroDto) {
    return await this.prisma.passageiro.update({
      data: request,
      where: { id }
    });
  }

  async getImage(id: number) {
    return await this.prisma.imagem.findFirst({
      where: { passageiro: { id } }
    });
  }

  async updateImage(id: number, file: Express.Multer.File) {
    const imagemExistente = await this.prisma.imagem.findFirst({
      where: {
        passageiro: { id },
      },
    });

    if (imagemExistente) {
      return await this.prisma.imagem.update({
        where: {
          id: imagemExistente.id,
        },
        data: {
          nome: file.originalname,
          mimeType: file.mimetype,
          arquivo: new Uint8Array(file.buffer),
        },
      });
    }

    return await this.prisma.imagem.create({
      data: {
        nome: file.originalname,
        mimeType: file.mimetype,
        arquivo: new Uint8Array(file.buffer),
        passageiro: {
          connect: { id },
        },
      },
    });
  }
}
