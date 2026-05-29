import { IsNotEmpty, Max, Min } from "class-validator";

export class AvaliarCorridaPassageiroDto {
    @IsNotEmpty({ message: 'corridaId é obrigatório' })
    corridaId: number;

    @IsNotEmpty({ message: 'Passageiro deve enviar notaCorrida' })
    @Min(1, { message: 'Valor mínimo permitido: 1' })
    @Max(5, { message: 'Valor máximo permitido: 5' })
    notaCorrida: number;

    @IsNotEmpty({ message: 'Passageiro deve enviar notaMotorista' })
    @Min(1, { message: 'Valor mínimo permitido: 1' })
    @Max(5, { message: 'Valor máximo permitido: 5' })
    notaMotorista: number;
}
