import { IsEmail, IsNotEmpty } from "class-validator";

export class CreatePassageiroDto {
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    nome: string;

    @IsEmail({}, { message: 'O email deve ser válido' })
    email: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    senha: string;

    @IsNotEmpty({ message: 'O celular é obrigatório' })
    celular: string;
}
