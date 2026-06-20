import { IsNotEmpty, Max, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AvaliarCorridaPassageiroDto {
    @ApiProperty({ example: 10, description: 'ID da corrida a ser avaliada' })
    @IsNotEmpty({ message: 'corridaId é obrigatório' })
    corridaId: number;

    @ApiProperty({ example: 5, description: 'Nota geral da corrida (1-5)' })
    @IsNotEmpty({ message: 'Passageiro deve enviar notaCorrida' })
    @Min(1, { message: 'Valor mínimo permitido: 1' })
    @Max(5, { message: 'Valor máximo permitido: 5' })
    notaCorrida: number;

    @ApiProperty({ example: 5, description: 'Nota do motorista atribuída pelo passageiro (1-5)' })
    @IsNotEmpty({ message: 'Passageiro deve enviar notaMotorista' })
    @Min(1, { message: 'Valor mínimo permitido: 1' })
    @Max(5, { message: 'Valor máximo permitido: 5' })
    notaMotorista: number;
}
