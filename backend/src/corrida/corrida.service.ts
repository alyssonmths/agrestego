import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCorridaDto } from './dto/create-corrida.dto';
import { AvaliarCorridaPassageiroDto } from './dto/avaliar-corrida-passageiro.dto';
import { AvaliarCorridaMotoristaDto } from './dto/avaliar-corrida-motorista.dto';
import { UpdateCorridaDto } from './dto/update-corrida.dto';
import { PrismaService } from 'src/database/prisma.service';
import { StatusCorrida, MetodoPagamento, StatusPagamento } from 'generated/prisma/enums';
import { PagarCorridaDto } from './dto/pagar-corrida.dto';

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
        valor: 5,
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
  async aceitarCorrida(id: number, motoristaId: number) {
    const motorista = await this.prisma.motorista.findUnique({
      where: { id: motoristaId }
    });

    if (!motorista) throw new NotFoundException('Motorista não foi encontrado. Certifique-se de estar logado para executar essa ação.');

    return this.prisma.corrida.update({
      data: {
        status: StatusCorrida.INICIADA,
        motoristaId: motoristaId
      },
      where: { id: Number(id) }
    });
  }

  async finalizar(id: number) {
    const corrida = await this.prisma.corrida.update({
      data: {
        status: StatusCorrida.FINALIZADA,
        fim: new Date(),
      },
      where: { id: Number(id) }
    });

    await this.prisma.pagamento.create({
      data: {
        corridaId: id,
        status: StatusPagamento.PENDENTE,
        valor: corrida.valor
      }
    });
  }

  async pagar(id: number, request: PagarCorridaDto) {
    const corrida = await this.prisma.corrida.findUnique({ where: { id: Number(id) } });
    if (!corrida) throw new NotFoundException('Corrida não encontrada');

    return await this.prisma.pagamento.update({
      data: {
        metodo: request.metodo as unknown as MetodoPagamento,
        status: StatusPagamento.PAGO,
      },
      where: {
        corridaId: corrida.id
      }
    });
  }
}
