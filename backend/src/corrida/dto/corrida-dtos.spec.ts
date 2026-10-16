import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AvaliarCorridaPassageiroDto } from './avaliar-corrida-passageiro.dto';
import { AvaliarCorridaMotoristaDto } from './avaliar-corrida-motorista.dto';
import { CreateCorridaDto } from './create-corrida.dto';
import { PagarCorridaDto } from './pagar-corrida.dto';

async function camposComErro(classe: new () => object, dados: object) {
  const erros = await validate(plainToInstance(classe, dados));
  return erros.map((erro) => erro.property);
}

describe('DTOs de corrida', () => {
  describe('AvaliarCorridaPassageiroDto', () => {
    it.each([1, 3, 5])('CT-DTO-01 - deve aceitar nota %d (dentro de 1 a 5)', async (nota) => {
      const campos = await camposComErro(AvaliarCorridaPassageiroDto, { corridaId: 1, notaCorrida: nota, notaMotorista: nota });

      expect(campos).toEqual([]);
    });

    it.each([0, 6, -1])('CT-DTO-02 - deve recusar nota %d (fora de 1 a 5)', async (nota) => {
      const campos = await camposComErro(AvaliarCorridaPassageiroDto, { corridaId: 1, notaCorrida: nota, notaMotorista: nota });

      expect(campos).toEqual(['notaCorrida', 'notaMotorista']);
    });

    it('CT-DTO-03 - deve exigir corridaId, notaCorrida e notaMotorista', async () => {
      const campos = await camposComErro(AvaliarCorridaPassageiroDto, {});

      expect(campos).toEqual(expect.arrayContaining(['corridaId', 'notaCorrida', 'notaMotorista']));
    });
  });

  describe('AvaliarCorridaMotoristaDto', () => {
    it.each([1, 5])('CT-DTO-04 - deve aceitar nota limite %d', async (nota) => {
      const campos = await camposComErro(AvaliarCorridaMotoristaDto, { corridaId: 1, notaPassageiro: nota });

      expect(campos).toEqual([]);
    });

    it.each([0, 6])('CT-DTO-05 - deve recusar nota %d', async (nota) => {
      const campos = await camposComErro(AvaliarCorridaMotoristaDto, { corridaId: 1, notaPassageiro: nota });

      expect(campos).toEqual(['notaPassageiro']);
    });

    it('CT-DTO-06 - deve exigir corridaId e notaPassageiro', async () => {
      const campos = await camposComErro(AvaliarCorridaMotoristaDto, {});

      expect(campos).toEqual(expect.arrayContaining(['corridaId', 'notaPassageiro']));
    });
  });

  describe('CreateCorridaDto', () => {
    it('CT-DTO-07 - deve aceitar origem e destino informados', async () => {
      await expect(camposComErro(CreateCorridaDto, { origemId: 1, destinoId: 2 })).resolves.toEqual([]);
    });

    it('CT-DTO-08 - deve exigir origem e destino', async () => {
      await expect(camposComErro(CreateCorridaDto, {})).resolves.toEqual(['origemId', 'destinoId']);
    });
  });

  describe('PagarCorridaDto', () => {
    it.each(['CARTAO', 'PIX', 'DINHEIRO'])('CT-DTO-09 - deve aceitar o método %s', async (metodo) => {
      await expect(camposComErro(PagarCorridaDto, { metodo })).resolves.toEqual([]);
    });

    it.each(['BOLETO', 'pix', ''])('CT-DTO-10 - deve recusar o método "%s"', async (metodo) => {
      await expect(camposComErro(PagarCorridaDto, { metodo })).resolves.toEqual(['metodo']);
    });
  });
});
