import { IsNotEmpty, Max, Min } from "class-validator";

export class AvaliarCorridaMotoristaDto {
    @IsNotEmpty({ message: 'corridaId é obrigatório' })
    corridaId: number;

    @IsNotEmpty({ message: 'Motorista deve enviar notaPassageiro' })
    @Min(1, { message: 'Valor mínimo permitido: 1' })
    @Max(5, { message: 'Valor máximo permitido: 5' })
    notaPassageiro: number;
}
