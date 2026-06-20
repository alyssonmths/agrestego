import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards,Put } from '@nestjs/common';
import { MotoristaService } from './motorista.service';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('motorista')
@ApiTags('Motorista')
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) {}
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do motorista autenticado' })
  @ApiResponse({ status: 200, description: 'Motorista atualizado' })
  @Put()
  update(@Req()req: any, @Body() updateMotoristaDto: UpdateMotoristaDto){
  const userId =req.user?.userId;
  return this.motoristaService.update(userId, updateMotoristaDto);
  }
}
