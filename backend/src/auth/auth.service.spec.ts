import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PassageiroService } from 'src/passageiro/passageiro.service';
import { MotoristaService } from 'src/motorista/motorista.service';

describe('AuthService', () => {
  let service: AuthService;
  let passageiroService: { findOne: jest.Mock; create: jest.Mock };
  let motoristaService: { findOne: jest.Mock; create: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  const passageiro = { id: 1, nome: 'Ana', email: 'ana@email.com', senha: 'senha123', celular: '81999990000' };
  const motorista = { id: 2, nome: 'Bruno', email: 'bruno@email.com', senha: 'senha456' };

  beforeEach(async () => {
    passageiroService = { findOne: jest.fn(), create: jest.fn() };
    motoristaService = { findOne: jest.fn(), create: jest.fn() };
    jwtService = { signAsync: jest.fn().mockResolvedValue('token-jwt') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PassageiroService, useValue: passageiroService },
        { provide: MotoristaService, useValue: motoristaService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('CT-AUTH-01 - deve ser instanciado', () => {
    expect(service).toBeDefined();
  });

  describe('signUpPassageiro', () => {
    const dto = { nome: 'Ana', email: 'ana@email.com', senha: 'senha123', celular: '81999990000' };

    it('CT-AUTH-02 - deve criar o passageiro e devolver o token quando o e-mail é novo', async () => {
      passageiroService.findOne.mockResolvedValue(null);
      motoristaService.findOne.mockResolvedValue(null);
      passageiroService.create.mockResolvedValue(passageiro);

      const resultado = await service.signUpPassageiro(dto);

      expect(passageiroService.create).toHaveBeenCalledWith(dto);
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: 'ana@email.com', role: 'passageiro' });
      expect(resultado).toEqual({ passageiro, access_token: 'token-jwt' });
    });

    it('CT-AUTH-03 - deve recusar e-mail já cadastrado como passageiro', async () => {
      passageiroService.findOne.mockResolvedValue(passageiro);

      await expect(service.signUpPassageiro(dto)).rejects.toThrow(ConflictException);
      expect(passageiroService.create).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('CT-AUTH-04 - deve recusar e-mail já cadastrado como motorista', async () => {
      passageiroService.findOne.mockResolvedValue(null);
      motoristaService.findOne.mockResolvedValue(motorista);

      await expect(service.signUpPassageiro(dto)).rejects.toThrow('Email já cadastrado');
      expect(passageiroService.create).not.toHaveBeenCalled();
    });
  });

  describe('signUpMotorista', () => {
    it('CT-AUTH-05 - deve delegar a criação ao MotoristaService', async () => {
      const dto = { nome: 'Bruno', email: 'bruno@email.com', celular: '81988880000', senha: 'senha456', cnh: '123', placa: 'ABC1D23', veiculo: 'Fiat Uno' };
      motoristaService.create.mockResolvedValue({ id: 2, ...dto });

      const resultado = await service.signUpMotorista(dto);

      expect(motoristaService.create).toHaveBeenCalledWith(dto);
      expect(resultado).toEqual({ id: 2, ...dto });
    });
  });

  describe('signIn', () => {
    it('CT-AUTH-06 - deve autenticar passageiro com senha correta', async () => {
      passageiroService.findOne.mockResolvedValue(passageiro);

      const resultado = await service.signIn('ana@email.com', 'senha123');

      expect(motoristaService.findOne).not.toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 1, email: 'ana@email.com', role: 'passageiro' });
      expect(resultado).toEqual({ access_token: 'token-jwt', role: 'passageiro' });
    });

    it('CT-AUTH-07 - deve autenticar motorista quando o e-mail não é de passageiro', async () => {
      passageiroService.findOne.mockResolvedValue(null);
      motoristaService.findOne.mockResolvedValue(motorista);

      const resultado = await service.signIn('bruno@email.com', 'senha456');

      expect(motoristaService.findOne).toHaveBeenCalledWith('bruno@email.com');
      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: 2, email: 'bruno@email.com', role: 'motorista' });
      expect(resultado).toEqual({ access_token: 'token-jwt', role: 'motorista' });
    });

    it('CT-AUTH-08 - deve recusar passageiro com senha incorreta', async () => {
      passageiroService.findOne.mockResolvedValue(passageiro);

      await expect(service.signIn('ana@email.com', 'errada')).rejects.toThrow(NotFoundException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('CT-AUTH-09 - deve recusar motorista com senha incorreta', async () => {
      passageiroService.findOne.mockResolvedValue(null);
      motoristaService.findOne.mockResolvedValue(motorista);

      await expect(service.signIn('bruno@email.com', 'errada')).rejects.toThrow('Usuário ou senha inválidos');
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('CT-AUTH-10 - deve recusar e-mail não cadastrado', async () => {
      passageiroService.findOne.mockResolvedValue(null);
      motoristaService.findOne.mockResolvedValue(null);

      await expect(service.signIn('ninguem@email.com', 'qualquer')).rejects.toThrow(NotFoundException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('CT-AUTH-11 - deve diferenciar maiúsculas e minúsculas na senha', async () => {
      passageiroService.findOne.mockResolvedValue(passageiro);

      await expect(service.signIn('ana@email.com', 'SENHA123')).rejects.toThrow(NotFoundException);
    });

    it('CT-AUTH-12 - deve recusar senha vazia', async () => {
      passageiroService.findOne.mockResolvedValue(passageiro);

      await expect(service.signIn('ana@email.com', '')).rejects.toThrow(NotFoundException);
    });
  });
});
