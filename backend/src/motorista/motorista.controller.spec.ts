import { Test, TestingModule } from '@nestjs/testing';
import { MotoristaController } from './motorista.controller';
import { MotoristaService } from './motorista.service';

describe('MotoristaController', () => {
  let controller: MotoristaController;
  let motoristaService: { update: jest.Mock };

  beforeEach(async () => {
    motoristaService = { update: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotoristaController],
      providers: [{ provide: MotoristaService, useValue: motoristaService }],
    }).compile();

    controller = module.get<MotoristaController>(MotoristaController);
  });

  it('CT-MOTC-01 - deve ser instanciado', () => {
    expect(controller).toBeDefined();
  });

  it('CT-MOTC-02 - update deve atualizar o motorista do token, não um id enviado no corpo', async () => {
    motoristaService.update.mockResolvedValue({ id: 2, veiculo: 'Gol' });

    const resultado = await controller.update({ user: { userId: 2 } }, { veiculo: 'Gol' });

    expect(motoristaService.update).toHaveBeenCalledWith(2, { veiculo: 'Gol' });
    expect(resultado).toEqual({ id: 2, veiculo: 'Gol' });
  });
});
