import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
    @IsEmail({}, { message: 'Endereço de email inválido' })
    @IsNotEmpty({ message: 'O email é obrigatório' })
    email: string = '';

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    password: string = '';
}