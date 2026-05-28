import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { CreateCorridaDto } from './dto/create-corrida.dto';
import { UpdateCorridaDto } from './dto/update-corrida.dto';

@Controller('corrida')
export class CorridaController {
  constructor(private readonly corridaService: CorridaService) {}

  @Post()
  create(@Body() createCorridaDto: CreateCorridaDto) {
    return this.corridaService.create(createCorridaDto);
  }

  @Get()
  findAll() {
    return this.corridaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corridaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCorridaDto: UpdateCorridaDto) {
    return this.corridaService.update(+id, updateCorridaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.corridaService.remove(+id);
  }
}
