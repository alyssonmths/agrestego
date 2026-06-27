import { Test, TestingModule } from '@nestjs/testing';
import { CorridaService } from './corrida.service';
import { PrismaService } from 'src/database/prisma.service';
import { StatusCorrida } from 'generated/prisma/enums';

describe('CorridaService', () => {
  let service: CorridaService;
  let prisma: { corrida: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      corrida: {
        findMany: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list finalized rides for the authenticated passenger', async () => {
    prisma.corrida.findMany.mockResolvedValue([]);

    await service.listarFinalizadasPorPassageiro(42);

    expect(prisma.corrida.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        passageiroId: 42,
        status: StatusCorrida.FINALIZADA,
      },
      orderBy: { fim: 'desc' },
    }));
  });
});
