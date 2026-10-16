import { Test, TestingModule } from '@nestjs/testing';
import { BairroController } from './bairro.controller';
import { BairroService } from './bairro.service';

describe('BairroController', () => {
  let controller: BairroController;
  let bairroService: { findAll: jest.Mock };

  beforeEach(async () => {
    bairroService = { findAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BairroController],
      providers: [{ provide: BairroService, useValue: bairroService }],
    }).compile();

    controller = module.get<BairroController>(BairroController);
  });

  it('CT-BAIC-01 - deve ser instanciado', () => {
    expect(controller).toBeDefined();
  });

  it('CT-BAIC-02 - findAll deve devolver os bairros do service', async () => {
    bairroService.findAll.mockResolvedValue([{ id: 1, nome: 'Centro' }]);

    await expect(controller.findAll()).resolves.toEqual([{ id: 1, nome: 'Centro' }]);
  });
});
