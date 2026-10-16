import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let config: { get: jest.Mock };

  beforeEach(() => {
    config = { get: jest.fn().mockReturnValue('segredo-de-teste') };
    strategy = new JwtStrategy(config as unknown as ConfigService);
  });

  it('CT-JWT-01 - deve ler a chave secreta JWT_SECRET_KEY da configuração', () => {
    expect(config.get).toHaveBeenCalledWith('JWT_SECRET_KEY');
  });

  it('CT-JWT-02 - validate deve mapear sub para userId e manter e-mail e papel', async () => {
    const usuario = await strategy.validate({ sub: 1, email: 'ana@email.com', role: 'passageiro', iat: 123, exp: 456 });

    expect(usuario).toEqual({ userId: 1, email: 'ana@email.com', role: 'passageiro' });
  });

  it('CT-JWT-03 - validate não deve repassar campos extras do token', async () => {
    const usuario = await strategy.validate({ sub: 2, email: 'bruno@email.com', role: 'motorista', senha: 'x' });

    expect(Object.keys(usuario).sort()).toEqual(['email', 'role', 'userId']);
  });
});
