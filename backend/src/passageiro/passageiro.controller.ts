import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('passageiro')
export class PassageiroController {
  constructor(private readonly passageiroService: PassageiroService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPassageiroDto: CreatePassageiroDto) {
    return this.passageiroService.create(createPassageiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: any, @Body() updatePassageiroDto: UpdatePassageiroDto) {
    const userId = req.user?.userId;
    return this.passageiroService.update(userId, updatePassageiroDto);
  }
}
