import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('passageiro')
@ApiTags('Passageiro')
export class PassageiroController {
  constructor(
    private readonly passageiroService: PassageiroService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Criar conta de passageiro' })
  @ApiResponse({ status: 201, description: 'Passageiro criado' })
  async create(@Body() createPassageiroDto: CreatePassageiroDto) {
    return await this.passageiroService.create(createPassageiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do passageiro autenticado' })
  @ApiResponse({ status: 200, description: 'Passageiro atualizado' })
  @Put()
  update(@Req() req: any, @Body() updatePassageiroDto: UpdatePassageiroDto) {
    const userId = req.user?.userId;
    return this.passageiroService.update(userId, updatePassageiroDto);
  }
}
