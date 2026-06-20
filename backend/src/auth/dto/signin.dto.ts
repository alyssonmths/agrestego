import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
    @ApiProperty({ example: 'usuario@exemplo.com', description: 'Email do usuário para autenticação' })
    @IsEmail({}, { message: 'Endereço de email inválido' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string = '';

    @ApiProperty({ example: 'senhaSegura123', description: 'Senha do usuário' })
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    password: string = '';
}