import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateEnderecoDto {
  @ApiProperty({ example: 'Casa', description: 'Rótulo do endereço para uso rápido' })
  @IsNotEmpty({ message: 'O apelido do endereço é obrigatório' })
  @MaxLength(50)
  apelido: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Nome do logradouro' })
  @IsNotEmpty({ message: 'O logradouro é obrigatório' })
  @MaxLength(100)
  logradouro: string;

  @ApiProperty({ example: '123', description: 'Número do endereço' })
  @IsNotEmpty({ message: 'O número é obrigatório' })
  @MaxLength(20)
  numero: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro do endereço' })
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  @MaxLength(60)
  bairro: string;

  @ApiProperty({ example: 'Caruaru', description: 'Cidade do endereço' })
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @MaxLength(60)
  cidade: string;

  @ApiProperty({ example: 'PE', description: 'Estado do endereço' })
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @MaxLength(2)
  estado: string;

  @ApiProperty({ example: '55000-000', description: 'CEP do endereço' })
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @MaxLength(10)
  cep: string;

  @ApiProperty({ example: 'Apto 101', description: 'Complemento do endereço', required: false })
  @IsOptional()
  @MaxLength(100)
  complemento?: string;
}
