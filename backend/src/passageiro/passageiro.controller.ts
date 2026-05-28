import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';

@Controller('passageiro')
export class PassageiroController {
  constructor(private readonly passageiroService: PassageiroService) {}

  @Post()
  create(@Body() createPassageiroDto: CreatePassageiroDto) {
    return this.passageiroService.create(createPassageiroDto);
  }
}
