import { Test, TestingModule } from '@nestjs/testing';
import { PassageiroService } from './passageiro.service';

describe('PassageiroService', () => {
  let service: PassageiroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PassageiroService],
    }).compile();

    service = module.get<PassageiroService>(PassageiroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
