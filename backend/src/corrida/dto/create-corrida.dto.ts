import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCorridaDto {
    @ApiProperty({ example: 1, description: 'ID do local de origem' })
    @IsNotEmpty({ message: 'Escolha a origem' })
    origemId: number;
    
    @ApiProperty({ example: 2, description: 'ID do local de destino' })
    @IsNotEmpty({ message: 'Escolha o destino' })
    destinoId: number;
}
