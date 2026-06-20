import { IsNotEmpty, Max, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AvaliarCorridaMotoristaDto {
    @ApiProperty({ example: 10, description: 'ID da corrida a ser avaliada' })
    @IsNotEmpty({ message: 'corridaId é obrigatório' })
    corridaId: number;

    @ApiProperty({ example: 4, description: 'Nota do passageiro atribuída pelo motorista (1-5)' })
    @IsNotEmpty({ message: 'Motorista deve enviar notaPassageiro' })
    @Min(1, { message: 'Valor mínimo permitido: 1' })
    @Max(5, { message: 'Valor máximo permitido: 5' })
    notaPassageiro: number;
}
