import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MetodoPagamentoDto {
  CARTAO = 'CARTAO',
  PIX = 'PIX',
  DINHEIRO = 'DINHEIRO'
}

export class PagarCorridaDto {
  @ApiProperty({ enum: MetodoPagamentoDto, example: MetodoPagamentoDto.CARTAO })
  @IsEnum(MetodoPagamentoDto)
  metodo: MetodoPagamentoDto;
}
