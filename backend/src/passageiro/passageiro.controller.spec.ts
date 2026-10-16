import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PassageiroController } from './passageiro.controller';
import { PassageiroService } from './passageiro.service';

describe('PassageiroController', () => {
  let controller: PassageiroController;
  let passageiroService: Record<
    'update' | 'getImage' | 'findById' | 'createEndereco' | 'listEnderecos' | 'deleteEndereco' | 'updateImage',
    jest.Mock
  >;
  let res: { setHeader: jest.Mock; send: jest.Mock };

  const req = { user: { userId: 1 } };
  const imagem = { id: 9, mimeType: 'image/png', arquivo: new Uint8Array([1, 2, 3]) };
  const arquivo = { originalname: 'foto.png', mimetype: 'image/png', buffer: Buffer.from([1, 2, 3]) } as Express.Multer.File;

  beforeEach(async () => {
    passageiroService = {
      update: jest.fn(),
      getImage: jest.fn(),
      findById: jest.fn(),
      createEndereco: jest.fn(),
      listEnderecos: jest.fn(),
      deleteEndereco: jest.fn(),
      updateImage: jest.fn(),
    };
    res = { setHeader: jest.fn(), send: jest.fn().mockReturnValue('enviado') };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassageiroController],
      providers: [{ provide: PassageiroService, useValue: passageiroService }],
    }).compile();

    controller = module.get<PassageiroController>(PassageiroController);
  });

  it('CT-PASC-01 - deve ser instanciado', () => {
    expect(controller).toBeDefined();
  });

  it('CT-PASC-02 - update deve atualizar o passageiro do token', () => {
    controller.update(req, { nome: 'Ana Maria' });

    expect(passageiroService.update).toHaveBeenCalledWith(1, { nome: 'Ana Maria' });
  });

  describe('getProfile', () => {
    it('CT-PASC-03 - deve devolver apenas id, nome, e-mail e celular (sem a senha)', async () => {
      passageiroService.findById.mockResolvedValue({ id: 1, nome: 'Ana', email: 'ana@email.com', celular: '81999990000', senha: 'senha123' });

      const resultado = await controller.getProfile(req);

      expect(resultado).toEqual({ id: 1, nome: 'Ana', email: 'ana@email.com', celular: '81999990000' });
      expect(resultado).not.toHaveProperty('senha');
    });

    it('CT-PASC-04 - deve lançar NotFoundException quando o passageiro não existe', async () => {
      passageiroService.findById.mockResolvedValue(null);

      await expect(controller.getProfile(req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getImage', () => {
    it('CT-PASC-05 - deve enviar a imagem com o Content-Type correto', async () => {
      passageiroService.getImage.mockResolvedValue(imagem);

      await controller.getImage(req, res as any);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(res.send).toHaveBeenCalledWith(imagem.arquivo);
    });

    it('CT-PASC-06 - deve lançar NotFoundException quando não há imagem', async () => {
      passageiroService.getImage.mockResolvedValue(null);

      await expect(controller.getImage(req, res as any)).rejects.toThrow(NotFoundException);
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe('endereços', () => {
    it('CT-PASC-07 - createEndereco deve criar o endereço para o passageiro do token', async () => {
      const dto = { apelido: 'Casa', logradouro: 'Rua A', numero: '1', bairro: 'Centro', cidade: 'Surubim', estado: 'PE', cep: '55750-000' };

      await controller.createEndereco(req, dto);

      expect(passageiroService.createEndereco).toHaveBeenCalledWith(1, dto);
    });

    it('CT-PASC-08 - listEnderecos deve listar os endereços do passageiro do token', async () => {
      passageiroService.listEnderecos.mockResolvedValue([{ id: 3 }]);

      await expect(controller.listEnderecos(req)).resolves.toEqual([{ id: 3 }]);
      expect(passageiroService.listEnderecos).toHaveBeenCalledWith(1);
    });

    it('CT-PASC-09 - deleteEndereco deve converter o id da rota para número', async () => {
      passageiroService.deleteEndereco.mockResolvedValue({ id: 3 });

      await controller.deleteEndereco(req, '3');

      expect(passageiroService.deleteEndereco).toHaveBeenCalledWith(1, 3);
    });

    it('CT-PASC-10 - deleteEndereco deve transformar erro do service em NotFoundException', async () => {
      passageiroService.deleteEndereco.mockRejectedValue(new Error('Endereço não encontrado ou sem permissão'));

      await expect(controller.deleteEndereco(req, '3')).rejects.toThrow(
        new NotFoundException('Endereço não encontrado ou sem permissão'),
      );
    });
  });

  describe('updateImage', () => {
    it('CT-PASC-11 - deve recusar requisição sem arquivo', async () => {
      await expect(controller.updateImage(req, undefined as any, res as any)).rejects.toThrow(BadRequestException);
      expect(passageiroService.updateImage).not.toHaveBeenCalled();
    });

    it('CT-PASC-12 - deve salvar e devolver a nova imagem', async () => {
      passageiroService.updateImage.mockResolvedValue(imagem);

      await controller.updateImage(req, arquivo, res as any);

      expect(passageiroService.updateImage).toHaveBeenCalledWith(1, arquivo);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'image/png');
      expect(res.send).toHaveBeenCalledWith(imagem.arquivo);
    });

    it('CT-PASC-13 - deve lançar NotFoundException quando o service não devolve imagem', async () => {
      passageiroService.updateImage.mockResolvedValue(null);

      await expect(controller.updateImage(req, arquivo, res as any)).rejects.toThrow(NotFoundException);
    });
  });
});
