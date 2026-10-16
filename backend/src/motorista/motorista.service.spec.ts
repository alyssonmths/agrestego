import { Test, TestingModule } from '@nestjs/testing';
import { MotoristaService } from './motorista.service';
import { PrismaService } from 'src/database/prisma.service';

describe('MotoristaService', () => {
  let service: MotoristaService;
  let prisma: { motorista: { create: jest.Mock; findUnique: jest.Mock; update: jest.Mock } };

  const dto = {
    nome: 'Bruno',
    email: 'bruno@email.com',
    celular: '81988880000',
    senha: 'senha456',
    cnh: '12345678900',
    placa: 'ABC1D23',
    veiculo: 'Fiat Uno',
  };

  beforeEach(async () => {
    prisma = { motorista: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MotoristaService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<MotoristaService>(MotoristaService);
  });

  it('CT-MOT-01 - deve ser instanciado', () => {
    expect(service).toBeDefined();
  });

  it('CT-MOT-02 - create deve gravar o motorista com os dados recebidos', async () => {
    prisma.motorista.create.mockResolvedValue({ id: 2, ...dto });

    const resultado = await service.create(dto);

    expect(prisma.motorista.create).toHaveBeenCalledWith({ data: dto });
    expect(resultado).toEqual({ id: 2, ...dto });
  });

  it('CT-MOT-03 - findOne deve buscar pelo e-mail', async () => {
    prisma.motorista.findUnique.mockResolvedValue({ id: 2, ...dto });

    const resultado = await service.findOne('bruno@email.com');

    expect(prisma.motorista.findUnique).toHaveBeenCalledWith({ where: { email: 'bruno@email.com' } });
    expect(resultado?.id).toBe(2);
  });

  it('CT-MOT-04 - findOne deve devolver null para e-mail não cadastrado', async () => {
    prisma.motorista.findUnique.mockResolvedValue(null);

    await expect(service.findOne('ninguem@email.com')).resolves.toBeNull();
  });

  it('CT-MOT-05 - update deve atualizar somente o motorista informado', async () => {
    prisma.motorista.update.mockResolvedValue({ id: 2, ...dto, placa: 'XYZ9W87' });

    await service.update(2, { placa: 'XYZ9W87' });

    expect(prisma.motorista.update).toHaveBeenCalledWith({ data: { placa: 'XYZ9W87' }, where: { id: 2 } });
  });
});
