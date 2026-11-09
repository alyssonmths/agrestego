import { validate } from "class-validator";
import { AvaliarCorridaPassageiroDto } from "./avaliar-corrida-passageiro.dto"

describe('AvaliarCorridaPassageiroDto - Testes do Grupo (Alysson)', () => {
    let dto: AvaliarCorridaPassageiroDto;

    beforeEach(() => {
        dto = new AvaliarCorridaPassageiroDto();
    });

    it('CT-G-03: deve retornar erro de validação caso a notaCorrida seja maior que o valor máximo permitido', async () => {
        dto.corridaId = 1;
        dto.notaCorrida = 6;
        dto.notaMotorista = 4;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toEqual('notaCorrida');
    });

    it('CT-G-03: deve retornar erro de validação caso a notaMotorista seja maior que o valor máximo permitido', async () => {
        dto.corridaId = 1;
        dto.notaCorrida = 4;
        dto.notaMotorista = 6;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toEqual('notaMotorista');
    });

    it('CT-G-03: deve retornar erro de validação caso a notaCorrida seja menor que o valor mínimo permitido', async () => {
        dto.corridaId = 1;
        dto.notaCorrida = 0;
        dto.notaMotorista = 4;

        const errors = await validate(dto);

        expect(errors).toHaveLength(1);
        expect(errors[0].property).toEqual('notaCorrida');
    })
})