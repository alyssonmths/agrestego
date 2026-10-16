import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signUpPassageiro: jest.Mock; signUpMotorista: jest.Mock; signIn: jest.Mock };

  beforeEach(async () => {
    authService = { signUpPassageiro: jest.fn(), signUpMotorista: jest.fn(), signIn: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('CT-AUTHC-01 - deve ser instanciado', () => {
    expect(controller).toBeDefined();
  });

  it('CT-AUTHC-02 - signUpPassageiro deve repassar o DTO e devolver a resposta do service', async () => {
    const dto = { nome: 'Ana', email: 'ana@email.com', senha: 'senha123', celular: '81999990000' };
    authService.signUpPassageiro.mockResolvedValue({ passageiro: { id: 1 }, access_token: 'token' });

    await expect(controller.signUpPassageiro(dto)).resolves.toEqual({ passageiro: { id: 1 }, access_token: 'token' });
    expect(authService.signUpPassageiro).toHaveBeenCalledWith(dto);
  });

  it('CT-AUTHC-03 - create deve cadastrar motorista pelo service', async () => {
    const dto = { nome: 'Bruno', email: 'bruno@email.com', celular: '81988880000', senha: 'senha456', cnh: '123', placa: 'ABC1D23', veiculo: 'Fiat Uno' };
    authService.signUpMotorista.mockResolvedValue({ id: 2 });

    await expect(controller.create(dto)).resolves.toEqual({ id: 2 });
    expect(authService.signUpMotorista).toHaveBeenCalledWith(dto);
  });

  it('CT-AUTHC-04 - signIn deve repassar e-mail e senha (campo password) ao service', async () => {
    authService.signIn.mockResolvedValue({ access_token: 'token', role: 'passageiro' });

    const resultado = await controller.signIn({ email: 'ana@email.com', password: 'senha123' });

    expect(authService.signIn).toHaveBeenCalledWith('ana@email.com', 'senha123');
    expect(resultado).toEqual({ access_token: 'token', role: 'passageiro' });
  });

  it('CT-AUTHC-05 - signIn deve propagar o erro de credenciais inválidas', async () => {
    authService.signIn.mockRejectedValue(new NotFoundException('Usuário ou senha inválidos'));

    await expect(controller.signIn({ email: 'ana@email.com', password: 'errada' })).rejects.toThrow(NotFoundException);
  });
});
