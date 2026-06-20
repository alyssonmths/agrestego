import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePassageiroDto {
    @ApiProperty({ example: 'João Silva', description: 'Nome completo do passageiro' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;

    @ApiProperty({ example: 'joao@exemplo.com', description: 'Email do passageiro' })
    @IsEmail({}, { message: 'O email deve ser válido' })
    email: string;

    @ApiProperty({ example: 'senhaSegura123', description: 'Senha para acesso' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    senha: string;

    @ApiProperty({ example: '+5511999998888', description: 'Número de celular com DDI e DDD' })
    @IsNotEmpty({ message: 'O celular é obrigatório' })
    celular: string;
}
