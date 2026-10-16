import { Test, TestingModule } from '@nestjs/testing';
import { CorridaController } from './corrida.controller';
import { CorridaService } from './corrida.service';
import { MetodoPagamentoDto } from './dto/pagar-corrida.dto';

describe('CorridaController', () => {
  let controller: CorridaController;
  let corridaService: Record<
    'create' | 'listarFinalizadasPorPassageiro' | 'findOne' | 'avaliarPassageiro' | 'avaliarMotorista' | 'aceitarCorrida' | 'finalizar' | 'listar' | 'pagar',
    jest.Mock
  >;

  beforeEach(async () => {
    corridaService = {
      create: jest.fn(),
      listarFinalizadasPorPassageiro: jest.fn(),
      findOne: jest.fn(),
      avaliarPassageiro: jest.fn(),
      avaliarMotorista: jest.fn(),
      aceitarCorrida: jest.fn(),
      finalizar: jest.fn(),
      listar: jest.fn(),
      pagar: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorridaController],
      providers: [{ provide: CorridaService, useValue: corridaService }],
    }).compile();

    controller = module.get<CorridaController>(CorridaController);
  });

  it('CT-CORC-01 - deve ser instanciado', () => {
    expect(controller).toBeDefined();
  });

  it('CT-CORC-02 - create deve criar a corrida para o usuário do token', () => {
    controller.create({ user: { userId: 7 } }, { origemId: 1, destinoId: 2 });

    expect(corridaService.create).toHaveBeenCalledWith({ origemId: 1, destinoId: 2 }, 7);
  });

  it('CT-CORC-03 - listarFinalizadas deve converter o id do token para número', () => {
    controller.listarFinalizadas({ user: { userId: '42' } });

    expect(corridaService.listarFinalizadasPorPassageiro).toHaveBeenCalledWith(42);
  });

  it('CT-CORC-04 - findOne deve converter o id da rota para número', () => {
    controller.findOne('15');

    expect(corridaService.findOne).toHaveBeenCalledWith(15);
  });

  it('CT-CORC-05 - avaliarPassageiro deve repassar a avaliação ao service', () => {
    const dto = { corridaId: 4, notaCorrida: 5, notaMotorista: 4 };

    controller.avaliarPassageiro(dto);

    expect(corridaService.avaliarPassageiro).toHaveBeenCalledWith(dto);
  });

  it('CT-CORC-06 - avaliarMotorista deve repassar a avaliação ao service', () => {
    const dto = { corridaId: 4, notaPassageiro: 3 };

    controller.avaliarMotorista(dto);

    expect(corridaService.avaliarMotorista).toHaveBeenCalledWith(dto);
  });

  it('CT-CORC-07 - aceitar deve usar o motorista do token e o id da rota como número', () => {
    controller.aceitar('5' as unknown as number, { user: { userId: 2 } });

    expect(corridaService.aceitarCorrida).toHaveBeenCalledWith(5, 2);
  });

  it('CT-CORC-08 - finalizar deve converter o id da rota para número', () => {
    controller.finalizar('6' as unknown as number);

    expect(corridaService.finalizar).toHaveBeenCalledWith(6);
  });

  it('CT-CORC-09 - Listar deve devolver as corridas solicitadas', async () => {
    corridaService.listar.mockResolvedValue([{ id: 1 }]);

    await expect(controller.Listar()).resolves.toEqual([{ id: 1 }]);
  });

  it('CT-CORC-10 - pagar deve converter o id e repassar o método de pagamento', () => {
    controller.pagar('8' as unknown as number, { metodo: MetodoPagamentoDto.PIX });

    expect(corridaService.pagar).toHaveBeenCalledWith(8, { metodo: MetodoPagamentoDto.PIX });
  });
});
