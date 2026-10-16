import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateMotoristaDto } from './create-motorista.dto';
import { UpdateMotoristaDto } from './update-motorista.dto';

async function camposComErro(classe: new () => object, dados: object) {
  const erros = await validate(plainToInstance(classe, dados));
  return erros.map((erro) => erro.property);
}

describe('DTOs de motorista', () => {
  const valido = {
    nome: 'Bruno',
    email: 'bruno@email.com',
    celular: '81988880000',
    senha: 'senha456',
    cnh: '12345678900',
    placa: 'ABC1D23',
    veiculo: 'Fiat Uno',
  };

  it('CT-DTO-22 - deve aceitar motorista com todos os campos válidos', async () => {
    await expect(camposComErro(CreateMotoristaDto, valido)).resolves.toEqual([]);
  });

  it('CT-DTO-23 - deve exigir todos os campos do motorista', async () => {
    const campos = await camposComErro(CreateMotoristaDto, {});

    expect(campos.sort()).toEqual(['celular', 'cnh', 'email', 'nome', 'placa', 'senha', 'veiculo']);
  });

  it('CT-DTO-24 - deve recusar e-mail inválido', async () => {
    await expect(camposComErro(CreateMotoristaDto, { ...valido, email: 'bruno' })).resolves.toEqual(['email']);
  });

  it('CT-DTO-25 - UpdateMotoristaDto deve aceitar atualização parcial', async () => {
    await expect(camposComErro(UpdateMotoristaDto, { placa: 'XYZ9W87' })).resolves.toEqual([]);
  });
});
