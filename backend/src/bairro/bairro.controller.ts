import { Controller, Get, UseGuards } from '@nestjs/common';
import { BairroService } from './bairro.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('bairro')
export class BairroController {
  constructor(private readonly bairroService: BairroService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar bairros cadastrados' })
  @ApiResponse({ status: 200, description: 'Lista de bairros' })
  @Get()
  async findAll() {
    return await this.bairroService.findAll();
  }
}
