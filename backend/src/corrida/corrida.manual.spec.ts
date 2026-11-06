import { Test, TestingModule } from '@nestjs/testing';
import { CorridaService } from './corrida.service';
import { PrismaService } from 'src/database/prisma.service';
import { StatusCorrida, StatusPagamento } from 'generated/prisma/enums';
import { MetodoPagamentoDto } from './dto/pagar-corrida.dto';

describe('CorridaService - Testes do Grupo (Marcio)', () => {
    let service: CorridaService;
    let prisma: {
        corrida: {
            update: jest.Mock;
            findUnique: jest.Mock;
        };
        pagamento: {
            create: jest.Mock;
            update: jest.Mock;
        };
    };

    beforeEach(async () => {
        prisma = {
            corrida: {
                update: jest.fn(),
                findUnique: jest.fn(),
            },
            pagamento: {
                create: jest.fn(),
                update: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CorridaService,
                {
                    provide: PrismaService,
                    useValue: prisma,
                },
            ],
        }).compile();

        service = module.get<CorridaService>(CorridaService);
    });

    // CT-G-07: finalizar (Partição de Equivalência)
    it('CT-G-07: deve finalizar corrida INICIADA e criar pagamento com status PENDENTE e valor 25.50', async () => {
        const corridaId = 1;
        const corridaMock = {
            id: corridaId,
            status: StatusCorrida.FINALIZADA,
            valor: 25.5,
        };

        prisma.corrida.update.mockResolvedValue(corridaMock);
        prisma.pagamento.create.mockResolvedValue({
            id: 1,
            corridaId,
            status: StatusPagamento.PENDENTE,
            valor: 25.5,
        });

        await service.finalizar(corridaId);

        // 1. Verifica se a corrida foi atualizada para FINALIZADA
        expect(prisma.corrida.update).toHaveBeenCalledWith({
            where: { id: corridaId },
            data: {
                status: StatusCorrida.FINALIZADA,
                fim: expect.any(Date),
            },
        });

        // 2. Verifica se o pagamento foi criado como PENDENTE e com valor correto
        expect(prisma.pagamento.create).toHaveBeenCalledWith({
            data: {
                corridaId,
                status: StatusPagamento.PENDENTE,
                valor: 25.5,
            },
        });
    });

    // CT-G-08: pagar (Partição de Equivalência - Regra de Negócio / Deve Falhar)
    it('CT-G-08: deve falhar e recusar pagar quando pagamento da corrida ja estiver PAGO', async () => {
        const corridaId = 1;

        // Corrida existe no banco com pagamento já PAGO
        prisma.corrida.findUnique.mockResolvedValue({
            id: corridaId,
            status: StatusCorrida.FINALIZADA,
            pagamento: { status: StatusPagamento.PAGO },
        });

        const dto = { metodo: MetodoPagamentoDto.PIX };

        /*
         * Conforme definido no planejamento:
         * O esperado pela REGRA DE NEGÓCIO seria recusar sem update (lançar exceção).
         * Como a função atual não valida se já foi pago, este teste VAI FALHAR,
         * evidenciando o defeito na função do sistema.
         */
        await expect(service.pagar(corridaId, dto as any)).rejects.toThrow();
        expect(prisma.pagamento.update).not.toHaveBeenCalled();
    });
});
