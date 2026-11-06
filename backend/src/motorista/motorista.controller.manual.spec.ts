import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MotoristaController } from './motorista.controller';
import { MotoristaService } from './motorista.service';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';

describe('MotoristaController — testes manuais', () => {
  let controller: MotoristaController;
  let motoristaService: { update: jest.Mock };

  const validationPipe = new ValidationPipe();

  beforeEach(async () => {
    motoristaService = { update: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotoristaController],
      providers: [{ provide: MotoristaService, useValue: motoristaService }],
    }).compile();

    controller = module.get<MotoristaController>(MotoristaController);
  });

  async function executarUpdateComValidacao(body: object) {
    const dto = await validationPipe.transform(body, {
      type: 'body',
      metatype: UpdateMotoristaDto,
    });

    return controller.update({ user: { userId: 2 } }, dto);
  }

  it('CT-MOTC-03 - deve aceitar atualização com corpo vazio', async () => {
    motoristaService.update.mockResolvedValue({ id: 2 });

    await executarUpdateComValidacao({});

    expect(motoristaService.update).toHaveBeenCalledWith(2, {});
  });

  it('CT-MOTC-04 - deve rejeitar e-mail inválido', async () => {
    await expect(
      executarUpdateComValidacao({ email: 'nao-e-email' }),
    ).rejects.toThrow(BadRequestException);

    expect(motoristaService.update).not.toHaveBeenCalled();
  });

  it('CT-MOTC-05 - deve rejeitar veículo vazio', async () => {
    await expect(
      executarUpdateComValidacao({ veiculo: '' }),
    ).rejects.toThrow(BadRequestException);

    expect(motoristaService.update).not.toHaveBeenCalled();
  });
});
