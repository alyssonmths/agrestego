import { Test, TestingModule } from '@nestjs/testing';
import { PassageiroService } from './passageiro.service';
import { PrismaService } from 'src/database/prisma.service';

describe('PassageiroService', () => {
  let service: PassageiroService;
  let prisma: {
    passageiro: { create: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    endereco: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; delete: jest.Mock };
    imagem: { findFirst: jest.Mock; create: jest.Mock; update: jest.Mock };
  };

  const endereco = {
    apelido: 'Casa',
    logradouro: 'Rua das Flores',
    numero: '123',
    bairro: 'Centro',
    cidade: 'Surubim',
    estado: 'PE',
    cep: '55750-000',
  };

  const arquivo = {
    originalname: 'foto.png',
    mimetype: 'image/png',
    buffer: Buffer.from([1, 2, 3]),
  } as Express.Multer.File;

  beforeEach(async () => {
    prisma = {
      passageiro: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      endereco: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
      imagem: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [PassageiroService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PassageiroService>(PassageiroService);
  });

  it('CT-PAS-01 - deve ser instanciado', () => {
    expect(service).toBeDefined();
  });

  describe('dados do passageiro', () => {
    it('CT-PAS-02 - create deve gravar o passageiro com os dados recebidos', async () => {
      const dto = { nome: 'Ana', email: 'ana@email.com', senha: 'senha123', celular: '81999990000' };
      prisma.passageiro.create.mockResolvedValue({ id: 1, ...dto });

      const resultado = await service.create(dto);

      expect(prisma.passageiro.create).toHaveBeenCalledWith({ data: dto });
      expect(resultado).toEqual({ id: 1, ...dto });
    });

    it('CT-PAS-03 - findOne deve buscar pelo e-mail', async () => {
      prisma.passageiro.findUnique.mockResolvedValue(null);

      const resultado = await service.findOne('ana@email.com');

      expect(prisma.passageiro.findUnique).toHaveBeenCalledWith({ where: { email: 'ana@email.com' } });
      expect(resultado).toBeNull();
    });

    it('CT-PAS-04 - findById deve buscar pelo id', async () => {
      prisma.passageiro.findUnique.mockResolvedValue({ id: 1 });

      await service.findById(1);

      expect(prisma.passageiro.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('CT-PAS-05 - update deve atualizar somente o passageiro informado', async () => {
      await service.update(1, { nome: 'Ana Maria' });

      expect(prisma.passageiro.update).toHaveBeenCalledWith({ data: { nome: 'Ana Maria' }, where: { id: 1 } });
    });
  });

  describe('endereços', () => {
    it('CT-PAS-06 - createEndereco deve conectar o endereço ao passageiro logado', async () => {
      await service.createEndereco(1, endereco);

      expect(prisma.endereco.create).toHaveBeenCalledWith({
        data: { ...endereco, passageiro: { connect: { id: 1 } } },
      });
    });

    it('CT-PAS-07 - listEnderecos deve listar só os endereços do passageiro, mais recentes primeiro', async () => {
      prisma.endereco.findMany.mockResolvedValue([]);

      await service.listEnderecos(1);

      expect(prisma.endereco.findMany).toHaveBeenCalledWith({
        where: { passageiroId: 1 },
        orderBy: { criadoEm: 'desc' },
      });
    });

    it('CT-PAS-08 - deleteEndereco deve excluir endereço do próprio passageiro', async () => {
      prisma.endereco.findUnique.mockResolvedValue({ id: 3, passageiroId: 1 });
      prisma.endereco.delete.mockResolvedValue({ id: 3 });

      const resultado = await service.deleteEndereco(1, 3);

      expect(prisma.endereco.delete).toHaveBeenCalledWith({ where: { id: 3 } });
      expect(resultado).toEqual({ id: 3 });
    });

    it('CT-PAS-09 - deleteEndereco deve recusar endereço inexistente', async () => {
      prisma.endereco.findUnique.mockResolvedValue(null);

      await expect(service.deleteEndereco(1, 3)).rejects.toThrow('Endereço não encontrado ou sem permissão');
      expect(prisma.endereco.delete).not.toHaveBeenCalled();
    });

    it('CT-PAS-10 - deleteEndereco deve recusar endereço de outro passageiro', async () => {
      prisma.endereco.findUnique.mockResolvedValue({ id: 3, passageiroId: 2 });

      await expect(service.deleteEndereco(1, 3)).rejects.toThrow('Endereço não encontrado ou sem permissão');
      expect(prisma.endereco.delete).not.toHaveBeenCalled();
    });
  });

  describe('imagem de perfil', () => {
    it('CT-PAS-11 - getImage deve buscar a imagem do passageiro', async () => {
      prisma.imagem.findFirst.mockResolvedValue(null);

      const resultado = await service.getImage(1);

      expect(prisma.imagem.findFirst).toHaveBeenCalledWith({ where: { passageiro: { id: 1 } } });
      expect(resultado).toBeNull();
    });

    it('CT-PAS-12 - updateImage deve criar imagem quando o passageiro ainda não tem', async () => {
      prisma.imagem.findFirst.mockResolvedValue(null);
      prisma.imagem.create.mockResolvedValue({ id: 9 });

      await service.updateImage(1, arquivo);

      expect(prisma.imagem.update).not.toHaveBeenCalled();
      expect(prisma.imagem.create).toHaveBeenCalledWith({
        data: {
          nome: 'foto.png',
          mimeType: 'image/png',
          arquivo: new Uint8Array([1, 2, 3]),
          passageiro: { connect: { id: 1 } },
        },
      });
    });

    it('CT-PAS-13 - updateImage deve substituir a imagem existente', async () => {
      prisma.imagem.findFirst.mockResolvedValue({ id: 9 });
      prisma.imagem.update.mockResolvedValue({ id: 9 });

      await service.updateImage(1, arquivo);

      expect(prisma.imagem.create).not.toHaveBeenCalled();
      expect(prisma.imagem.update).toHaveBeenCalledWith({
        where: { id: 9 },
        data: { nome: 'foto.png', mimeType: 'image/png', arquivo: new Uint8Array([1, 2, 3]) },
      });
    });
  });
});
