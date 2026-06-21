import { Controller, Get, Post, Body, Put, Req, UseGuards, UploadedFile, Res, NotFoundException, UseInterceptors, BadRequestException } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import type { Response } from 'express';
import { UpdatePassageiroDto } from './dto/update-passageiro.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter imagem de perfil de um passageiro' })
  @ApiResponse({ status: 200, description: 'Imagem de perfil' })
  @Get('image')
  async getImage(@Req() req: any, @Res() res: Response) {
    const userId = req.user?.userId;
    const imagem = await this.passageiroService.getImage(userId);

    if (!imagem) {
      throw new NotFoundException('Imagem não encontrada');
    }

    res.setHeader('Content-Type', imagem.mimeType);
    return res.send(imagem.arquivo);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza a imagem de perfil de um passageiro' })
  @ApiResponse({ status: 200, description: 'Imagem de perfil atualizada' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        arquivo: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('arquivo'))
  @Put('image')
  async updateImage(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    const userId = req.user?.userId;
    if (!file) {
      throw new BadRequestException('Arquivo não enviado');
    }

    const imagem = await this.passageiroService.updateImage(userId, file);

    if (!imagem) {
      throw new NotFoundException('Não foi possível atualizar a imagem');
    }

    res.setHeader('Content-Type', imagem.mimeType);
    return res.send(imagem.arquivo);
  }
}
