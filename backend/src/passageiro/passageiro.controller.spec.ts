import { Test, TestingModule } from '@nestjs/testing';
import { PassageiroController } from './passageiro.controller';
import { PassageiroService } from './passageiro.service';

describe('PassageiroController', () => {
  let controller: PassageiroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassageiroController],
      providers: [PassageiroService],
    }).compile();

    controller = module.get<PassageiroController>(PassageiroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
