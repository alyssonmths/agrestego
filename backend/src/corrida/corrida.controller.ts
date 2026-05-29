import { Controller, Post, Body, UseGuards, Req, Put } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { CreateCorridaDto } from './dto/create-corrida.dto';
import { AvaliarCorridaPassageiroDto } from './dto/avaliar-corrida-passageiro.dto';
import { AvaliarCorridaMotoristaDto } from './dto/avaliar-corrida-motorista.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('corrida')
export class CorridaController {
  constructor(private readonly corridaService: CorridaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() createCorridaDto: CreateCorridaDto) {
    const userId = req.user?.userId;
    return this.corridaService.create(createCorridaDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('avaliar-passageiro')
  avaliarPassageiro(@Body() avaliarCorridaPassageiroDto: AvaliarCorridaPassageiroDto) {
    return this.corridaService.avaliarPassageiro(avaliarCorridaPassageiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('avaliar-motorista')
  avaliarMotorista(@Body() avaliarCorridaMotoristaDto: AvaliarCorridaMotoristaDto) {
    return this.corridaService.avaliarMotorista(avaliarCorridaMotoristaDto);
  }
}
