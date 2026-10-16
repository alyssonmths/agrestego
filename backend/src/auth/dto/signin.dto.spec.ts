import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SignInDto } from './signin.dto';

async function camposComErro(dados: object) {
  const erros = await validate(plainToInstance(SignInDto, dados));
  return erros.map((erro) => erro.property);
}

describe('SignInDto', () => {
  it('CT-DTO-11 - deve aceitar e-mail válido e senha preenchida', async () => {
    await expect(camposComErro({ email: 'ana@email.com', password: 'senha123' })).resolves.toEqual([]);
  });

  it.each(['ana', 'ana@', '@email.com', ''])('CT-DTO-12 - deve recusar e-mail inválido "%s"', async (email) => {
    await expect(camposComErro({ email, password: 'senha123' })).resolves.toEqual(['email']);
  });

  it('CT-DTO-13 - deve exigir a senha', async () => {
    await expect(camposComErro({ email: 'ana@email.com', password: '' })).resolves.toEqual(['password']);
  });
});
