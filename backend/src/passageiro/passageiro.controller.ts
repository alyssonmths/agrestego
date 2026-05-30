import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('passageiro')
export class PassageiroController {
  constructor(
    private readonly passageiroService: PassageiroService,
    private readonly jwtService: JwtService,
  ) { }

  @Post()
  async create(@Body() createPassageiroDto: CreatePassageiroDto) {
    const passageiro = await this.passageiroService.create(createPassageiroDto);

    // Gerar JWT
    const payload = {
      sub: passageiro.id,
      email: passageiro.email,
      role: 'passageiro',
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      passageiro,
      access_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req: any, @Body() updatePassageiroDto: UpdatePassageiroDto) {
    const userId = req.user?.userId;
    return this.passageiroService.update(userId, updatePassageiroDto);
  }
}
