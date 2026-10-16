import { Test, TestingModule } from '@nestjs/testing';
import { BairroService } from './bairro.service';
import { PrismaService } from 'src/database/prisma.service';

describe('BairroService', () => {
  let service: BairroService;
  let prisma: { bairro: { findMany: jest.Mock } };

  beforeEach(async () => {
    prisma = { bairro: { findMany: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [BairroService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<BairroService>(BairroService);
  });

  it('CT-BAI-01 - deve ser instanciado', () => {
    expect(service).toBeDefined();
  });

  it('CT-BAI-02 - findAll deve devolver todos os bairros cadastrados', async () => {
    const bairros = [{ id: 1, nome: 'Centro' }, { id: 2, nome: 'São José' }];
    prisma.bairro.findMany.mockResolvedValue(bairros);

    await expect(service.findAll()).resolves.toEqual(bairros);
    expect(prisma.bairro.findMany).toHaveBeenCalledTimes(1);
  });

  it('CT-BAI-03 - findAll deve devolver lista vazia quando não há bairros', async () => {
    prisma.bairro.findMany.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);
  });
});
