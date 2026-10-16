import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { PrismaService } from 'src/database/prisma.service';
import { StatusCorrida, StatusPagamento } from 'generated/prisma/enums';
import { MetodoPagamentoDto } from './dto/pagar-corrida.dto';

describe('CorridaService', () => {
  let service: CorridaService;
  let prisma: {
    corrida: { create: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock; update: jest.Mock };
    avaliacao: { create: jest.Mock; update: jest.Mock };
    motorista: { findUnique: jest.Mock };
    pagamento: { create: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      corrida: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
      avaliacao: { create: jest.fn(), update: jest.fn() },
      motorista: { findUnique: jest.fn() },
      pagamento: { create: jest.fn(), update: jest.fn() },
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

  it('CT-COR-01 - deve ser instanciado', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('CT-COR-02 - deve criar corrida SOLICITADA com valor 5 para o passageiro logado', async () => {
      prisma.corrida.create.mockResolvedValue({ id: 10 });

      await service.create({ origemId: 1, destinoId: 2 }, 7);

      expect(prisma.corrida.create).toHaveBeenCalledWith({
        data: {
          origemId: 1,
          destinoId: 2,
          passageiroId: 7,
          status: StatusCorrida.SOLICITADA,
          valor: 5,
        },
      });
    });

    it('CT-COR-03 - deve criar uma avaliação em branco ligada à corrida', async () => {
      prisma.corrida.create.mockResolvedValue({ id: 10 });

      const corrida = await service.create({ origemId: 1, destinoId: 2 }, 7);

      expect(prisma.avaliacao.create).toHaveBeenCalledWith({ data: { corridaId: 10 } });
      expect(corrida).toEqual({ id: 10 });
    });

    it('CT-COR-04 - não deve criar avaliação se a criação da corrida falhar', async () => {
      prisma.corrida.create.mockRejectedValue(new Error('falha no banco'));

      await expect(service.create({ origemId: 1, destinoId: 2 }, 7)).rejects.toThrow('falha no banco');
      expect(prisma.avaliacao.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('CT-COR-05 - deve devolver a corrida encontrada', async () => {
      const corrida = { id: 3, status: StatusCorrida.INICIADA };
      prisma.corrida.findUnique.mockResolvedValue(corrida);

      const resultado = await service.findOne(3);

      expect(prisma.corrida.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 3 } }));
      expect(resultado).toBe(corrida);
    });

    it('CT-COR-06 - deve lançar NotFoundException quando a corrida não existe', async () => {
      prisma.corrida.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('CT-COR-07 - não deve expor dados sensíveis do motorista', async () => {
      prisma.corrida.findUnique.mockResolvedValue({ id: 3 });

      await service.findOne(3);

      const { include } = prisma.corrida.findUnique.mock.calls[0][0];
      expect(include.motorista.select).toEqual({ id: true, nome: true, placa: true, veiculo: true });
    });
  });

  describe('avaliações', () => {
    it('CT-COR-08 - avaliarPassageiro deve gravar nota da corrida e do motorista', async () => {
      await service.avaliarPassageiro({ corridaId: 4, notaCorrida: 5, notaMotorista: 4 });

      expect(prisma.avaliacao.update).toHaveBeenCalledWith({
        data: { notaCorrida: 5, notaMotorista: 4 },
        where: { corridaId: 4 },
      });
    });

    it('CT-COR-09 - avaliarMotorista deve gravar apenas a nota do passageiro', async () => {
      await service.avaliarMotorista({ corridaId: 4, notaPassageiro: 3 });

      expect(prisma.avaliacao.update).toHaveBeenCalledWith({
        data: { notaPassageiro: 3 },
        where: { corridaId: 4 },
      });
    });
  });

  describe('aceitarCorrida', () => {
    it('CT-COR-10 - deve iniciar a corrida e associar o motorista', async () => {
      prisma.motorista.findUnique.mockResolvedValue({ id: 2 });
      prisma.corrida.update.mockResolvedValue({ id: 5, status: StatusCorrida.INICIADA, motoristaId: 2 });

      const resultado = await service.aceitarCorrida(5, 2);

      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(prisma.corrida.update).toHaveBeenCalledWith({
        data: { status: StatusCorrida.INICIADA, motoristaId: 2 },
        where: { id: 5 },
      });
      expect(resultado.status).toBe(StatusCorrida.INICIADA);
    });

    it('CT-COR-11 - deve recusar quando o motorista não existe', async () => {
      prisma.motorista.findUnique.mockResolvedValue(null);

      await expect(service.aceitarCorrida(5, 999)).rejects.toThrow(NotFoundException);
      expect(prisma.corrida.update).not.toHaveBeenCalled();
    });
  });

  describe('finalizar', () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('2026-10-16T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('CT-COR-12 - deve marcar a corrida como FINALIZADA com a data atual', async () => {
      prisma.corrida.update.mockResolvedValue({ id: 6, valor: 5 });

      await service.finalizar(6);

      expect(prisma.corrida.update).toHaveBeenCalledWith({
        data: { status: StatusCorrida.FINALIZADA, fim: new Date('2026-10-16T12:00:00Z') },
        where: { id: 6 },
      });
    });

    it('CT-COR-13 - deve criar pagamento PENDENTE com o valor da corrida', async () => {
      prisma.corrida.update.mockResolvedValue({ id: 6, valor: 12.5 });

      await service.finalizar(6);

      expect(prisma.pagamento.create).toHaveBeenCalledWith({
        data: { corridaId: 6, status: StatusPagamento.PENDENTE, valor: 12.5 },
      });
    });

    it('CT-COR-14 - não deve criar pagamento se a atualização da corrida falhar', async () => {
      prisma.corrida.update.mockRejectedValue(new Error('corrida inexistente'));

      await expect(service.finalizar(6)).rejects.toThrow('corrida inexistente');
      expect(prisma.pagamento.create).not.toHaveBeenCalled();
    });
  });

  describe('pagar', () => {
    it.each([MetodoPagamentoDto.CARTAO, MetodoPagamentoDto.PIX, MetodoPagamentoDto.DINHEIRO])(
      'CT-COR-15 - deve registrar pagamento PAGO com o método %s',
      async (metodo) => {
        prisma.corrida.findUnique.mockResolvedValue({ id: 8 });
        prisma.pagamento.update.mockResolvedValue({ corridaId: 8, metodo, status: StatusPagamento.PAGO });

        const resultado = await service.pagar(8, { metodo });

        expect(prisma.pagamento.update).toHaveBeenCalledWith({
          data: { metodo, status: StatusPagamento.PAGO },
          where: { corridaId: 8 },
        });
        expect(resultado.status).toBe(StatusPagamento.PAGO);
      },
    );

    it('CT-COR-16 - deve recusar pagamento de corrida inexistente', async () => {
      prisma.corrida.findUnique.mockResolvedValue(null);

      await expect(service.pagar(99, { metodo: MetodoPagamentoDto.PIX })).rejects.toThrow(NotFoundException);
      expect(prisma.pagamento.update).not.toHaveBeenCalled();
    });
  });

  describe('listagens', () => {
    it('CT-COR-17 - listar deve buscar apenas corridas SOLICITADAS com origem e destino', async () => {
      prisma.corrida.findMany.mockResolvedValue([{ id: 1 }]);

      const resultado = await service.listar();

      expect(prisma.corrida.findMany).toHaveBeenCalledWith({
        where: { status: StatusCorrida.SOLICITADA },
        include: { origem: true, destino: true },
      });
      expect(resultado).toEqual([{ id: 1 }]);
    });

    it('CT-COR-18 - deve listar corridas finalizadas do passageiro, mais recentes primeiro', async () => {
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
});
