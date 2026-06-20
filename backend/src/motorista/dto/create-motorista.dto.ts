import {IsEmail, IsNotEmpty} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateMotoristaDto {
  @ApiProperty({ example: 'Maria Pereira', description: 'Nome completo do motorista' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'maria@exemplo.com', description: 'Email do motorista' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  email: string;

  @ApiProperty({ example: '+5511988887777', description: 'Telefone/celular do motorista' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  celular: string;

  @ApiProperty({ example: 'senhaSegura123', description: 'Senha para acesso' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  senha: string;

  @ApiProperty({ example: 'ABC1234', description: 'Número da CNH do motorista' })
  @IsNotEmpty({ message: 'A CNH é obrigatória' })
  cnh: string;
    
  @ApiProperty({ example: 'XYZ-9999', description: 'Placa do veículo' })
  @IsNotEmpty({ message: 'A placa é obrigatória' })
  placa: string;

  @ApiProperty({ example: 'Fiat Uno', description: 'Modelo do veículo' })
  @IsNotEmpty({ message: 'O veículo é obrigatório' })
  veiculo: string;
}
