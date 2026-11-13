import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CorridaService } from './corrida.service';
import { PrismaService } from 'src/database/prisma.service';
import { StatusCorrida } from 'generated/prisma/enums';

describe('CorridaService - Testes do Grupo (Lucas)', () => {
    let service: CorridaService;
    let prisma: {
        motorista: { findUnique: jest.Mock };
        corrida: { update: jest.Mock };
    };

    beforeEach(async () => {
        prisma = {
            motorista: { findUnique: jest.fn() },
            corrida: { update: jest.fn() },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CorridaService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<CorridaService>(CorridaService);
    });

    // Partição de equivalência: motorista existente
    it('CT-G-05 - deve aceitar corrida SOLICITADA com motorista existente, iniciando-a com o motoristaId informado', async () => {
        const corridaId = 1;
        const motoristaId = 2;
        const corridaIniciada = {
            id: corridaId,
            status: StatusCorrida.INICIADA,
            motoristaId,
        };

        prisma.motorista.findUnique.mockResolvedValue({ id: motoristaId });
        prisma.corrida.update.mockResolvedValue(corridaIniciada);

        const resultado = await service.aceitarCorrida(corridaId, motoristaId);

        expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
            where: { id: motoristaId },
        });
        expect(prisma.corrida.update).toHaveBeenCalledWith({
            data: {
                status: StatusCorrida.INICIADA,
                motoristaId,
            },
            where: { id: corridaId },
        });
        expect(resultado).toEqual(corridaIniciada);
    });

    // Partição de equivalência: motorista inexistente
    it('CT-G-06 - deve lançar NotFoundException e não atualizar a corrida quando o motorista não existe', async () => {
        prisma.motorista.findUnique.mockResolvedValue(null);

        await expect(service.aceitarCorrida(1, 999)).rejects.toThrow(
            NotFoundException,
        );
        expect(prisma.corrida.update).not.toHaveBeenCalled();
    });
});