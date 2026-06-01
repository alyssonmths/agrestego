import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards,Put } from '@nestjs/common';
import { MotoristaService } from './motorista.service';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';

@Controller('motorista')
export class MotoristaController {
  constructor(private readonly motoristaService: MotoristaService) {}
  
  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req()req: any, @Body() updateMotoristaDto: UpdateMotoristaDto){
  const userId =req.user?.userId;
  return this.motoristaService.update(userId, updateMotoristaDto);
  }
}
