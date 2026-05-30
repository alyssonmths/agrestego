import { Injectable } from '@nestjs/common';
import { CreateCorridaDto } from './dto/create-corrida.dto';
import { AvaliarCorridaPassageiroDto } from './dto/avaliar-corrida-passageiro.dto';
import { AvaliarCorridaMotoristaDto } from './dto/avaliar-corrida-motorista.dto';
import { UpdateCorridaDto } from './dto/update-corrida.dto';
import { PrismaService } from 'src/database/prisma.service';
import { StatusCorrida } from 'generated/prisma/enums';

@Injectable()
export class CorridaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(request: CreateCorridaDto, userId: number) {
    // Cria corrida
    const corrida = await this.prisma.corrida.create({
      data: {
        ...request,
        passageiroId: userId,
        status: StatusCorrida.SOLICITADA,
        valor: 5
      },
    });

    // Cria avaliação em branco
    await this.prisma.avaliacao.create({
      data: {
        corridaId: corrida.id
      }
    });

    return corrida;
  }

  async avaliarPassageiro(request: AvaliarCorridaPassageiroDto) {
    await this.prisma.avaliacao.update({
      data: {
        notaCorrida: request.notaCorrida,
        notaMotorista: request.notaMotorista
      },
      where: { corridaId: request.corridaId }
    });
  }

  async avaliarMotorista(request: AvaliarCorridaMotoristaDto) {
    await this.prisma.avaliacao.update({
      data: {
        notaPassageiro: request.notaPassageiro
      },
      where: { corridaId: request.corridaId }
    });
  }
  async aceitarCorrida(id: number, motoristaId: number){
    return this.prisma.corrida.update({
      data:{
        status: StatusCorrida.INICIADA,
        motoristaId:motoristaId
       },
      where: { id }
    });
  }
}
