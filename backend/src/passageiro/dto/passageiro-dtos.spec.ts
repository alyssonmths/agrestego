import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreatePassageiroDto } from './create-passageiro.dto';
import { CreateEnderecoDto } from './create-endereco.dto';
import { UpdatePassageiroDto } from './update-passageiro.dto';

async function camposComErro(classe: new () => object, dados: object) {
  const erros = await validate(plainToInstance(classe, dados));
  return erros.map((erro) => erro.property);
}

const enderecoValido = {
  apelido: 'Casa',
  logradouro: 'Rua das Flores',
  numero: '123',
  bairro: 'Centro',
  cidade: 'Surubim',
  estado: 'PE',
  cep: '55750-000',
};

describe('DTOs de passageiro', () => {
  describe('CreatePassageiroDto', () => {
    const valido = { nome: 'Ana', email: 'ana@email.com', senha: 'senha123', celular: '81999990000' };

    it('CT-DTO-14 - deve aceitar passageiro com todos os campos válidos', async () => {
      await expect(camposComErro(CreatePassageiroDto, valido)).resolves.toEqual([]);
    });

    it('CT-DTO-15 - deve exigir nome, e-mail, senha e celular', async () => {
      const campos = await camposComErro(CreatePassageiroDto, {});

      expect(campos).toEqual(expect.arrayContaining(['nome', 'email', 'senha', 'celular']));
    });

    it('CT-DTO-16 - deve recusar e-mail inválido', async () => {
      await expect(camposComErro(CreatePassageiroDto, { ...valido, email: 'ana.email.com' })).resolves.toEqual(['email']);
    });
  });

  describe('UpdatePassageiroDto', () => {
    it('CT-DTO-17 - deve aceitar atualização parcial', async () => {
      await expect(camposComErro(UpdatePassageiroDto, { nome: 'Ana Maria' })).resolves.toEqual([]);
    });

    it('CT-DTO-18 - deve validar o formato do e-mail quando informado', async () => {
      await expect(camposComErro(UpdatePassageiroDto, { email: 'invalido' })).resolves.toEqual(['email']);
    });
  });

  describe('CreateEnderecoDto', () => {
    it('CT-DTO-19 - deve aceitar endereço válido sem complemento', async () => {
      await expect(camposComErro(CreateEnderecoDto, enderecoValido)).resolves.toEqual([]);
    });

    it('CT-DTO-20 - deve exigir todos os campos, exceto complemento', async () => {
      const campos = await camposComErro(CreateEnderecoDto, {});

      expect(campos.sort()).toEqual(['apelido', 'bairro', 'cep', 'cidade', 'estado', 'logradouro', 'numero']);
    });

    it.each([
      ['apelido', 50],
      ['logradouro', 100],
      ['numero', 20],
      ['bairro', 60],
      ['cidade', 60],
      ['estado', 2],
      ['cep', 10],
      ['complemento', 100],
    ])('CT-DTO-21 - %s deve aceitar exatamente %d caracteres e recusar um a mais', async (campo, limite) => {
      const noLimite = await camposComErro(CreateEnderecoDto, { ...enderecoValido, [campo]: 'a'.repeat(limite) });
      const acimaDoLimite = await camposComErro(CreateEnderecoDto, { ...enderecoValido, [campo]: 'a'.repeat(limite + 1) });

      expect(noLimite).toEqual([]);
      expect(acimaDoLimite).toEqual([campo]);
    });
  });
});
