import { Controller, Post, Body, UseGuards, Req, Put, Param, Get } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { CreateCorridaDto } from './dto/create-corrida.dto';
import { AvaliarCorridaPassageiroDto } from './dto/avaliar-corrida-passageiro.dto';
import { AvaliarCorridaMotoristaDto } from './dto/avaliar-corrida-motorista.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PagarCorridaDto } from './dto/pagar-corrida.dto';

@Controller('corrida')
@ApiTags('Corrida')
export class CorridaController {
  constructor(private readonly corridaService: CorridaService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova corrida' })
  @ApiResponse({ status: 201, description: 'Corrida criada' })
  @Post()
  create(@Req() req: any, @Body() createCorridaDto: CreateCorridaDto) {
    const userId = req.user?.userId;
    return this.corridaService.create(createCorridaDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter corrida por ID' })
  @ApiResponse({ status: 200, description: 'Corrida encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corridaService.findOne(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Avaliar corrida como passageiro' })
  @ApiResponse({ status: 200, description: 'Avaliação registrada' })
  @Put('avaliar-passageiro')
  avaliarPassageiro(@Body() avaliarCorridaPassageiroDto: AvaliarCorridaPassageiroDto) {
    return this.corridaService.avaliarPassageiro(avaliarCorridaPassageiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Avaliar passageiro como motorista' })
  @ApiResponse({ status: 200, description: 'Avaliação registrada' })
  @Put('avaliar-motorista')
  avaliarMotorista(@Body() avaliarCorridaMotoristaDto: AvaliarCorridaMotoristaDto) {
    return this.corridaService.avaliarMotorista(avaliarCorridaMotoristaDto);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Motorista aceita uma corrida' })
  @ApiResponse({ status: 200, description: 'Corrida aceita pelo motorista' })
  @Put(":id/aceitar")
  aceitar(@Param("id")id: number, @Req() req: any) {  
    const motoristaId = req.user?.userId;
    return this.corridaService.aceitarCorrida(Number(id), motoristaId);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finalizar corrida' })
  @ApiResponse({ status: 200, description: 'Corrida finalizada' })
  @Put(":id/finalizar")
  finalizar(@Param("id") id: number) {
    return this.corridaService.finalizar(Number(id));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pagar corrida' })
  @ApiResponse({ status: 200, description: 'Pagamento registrado' })
  @Post(":id/pagar")
  pagar(@Param("id") id: number, @Body() pagarCorridaDto: PagarCorridaDto) {
    return this.corridaService.pagar(Number(id), pagarCorridaDto);
  }

}
