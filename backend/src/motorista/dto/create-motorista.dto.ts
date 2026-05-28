import {IsEmail, IsNotEmpty} from "class-validator";
export class CreateMotoristaDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  celular: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;

  @IsNotEmpty({ message: 'A CNH é obrigatória' })
    cnh: string;
    
    @IsNotEmpty({ message: 'A placa é obrigatória' })
    placa: string;

    @IsNotEmpty({ message: 'O veículo é obrigatório' })
    veiculo: string;
}
