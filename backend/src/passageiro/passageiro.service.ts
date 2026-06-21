import { Injectable, NotFoundException, Res } from '@nestjs/common';
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
