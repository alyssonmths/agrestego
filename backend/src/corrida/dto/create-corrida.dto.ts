import { IsNotEmpty } from "class-validator";

export class CreateCorridaDto {
    @IsNotEmpty({ message: 'Escolha a origem' })
    origemId: number;
    
    @IsNotEmpty({ message: 'Escolha o destino' })
    destinoId: number;
}
