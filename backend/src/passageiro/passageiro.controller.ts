import { Controller, Get, Post, Body, Put, Req, UseGuards, UploadedFile, Res, NotFoundException, UseInterceptors, BadRequestException, Delete, Param } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { CreatePassageiroDto } from './dto/create-passageiro.dto';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
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
  @ApiOperation({ summary: 'Obter dados do passageiro autenticado' })
  @ApiResponse({ status: 200, description: 'Dados do passageiro' })
  @Get()
  async getProfile(@Req() req: any) {
    const userId = req.user?.userId;
    const passageiro = await this.passageiroService.findById(userId);

    if (!passageiro) {
      throw new NotFoundException('Passageiro não encontrado');
    }

    const { id, nome, email, celular } = passageiro;
    return { id, nome, email, celular };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar um endereço salvo do passageiro autenticado' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso' })
  @Post('enderecos')
  async createEndereco(@Req() req: any, @Body() createEnderecoDto: CreateEnderecoDto) {
    const userId = req.user?.userId;
    return this.passageiroService.createEndereco(userId, createEnderecoDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar endereços do passageiro autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de endereços' })
  @Get('enderecos')
  async listEnderecos(@Req() req: any) {
    const userId = req.user?.userId;
    return this.passageiroService.listEnderecos(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir um endereço do passageiro autenticado' })
  @ApiResponse({ status: 200, description: 'Endereço excluído' })
  @Delete('enderecos/:id')
  async deleteEndereco(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    try {
      return await this.passageiroService.deleteEndereco(userId, Number(id));
    } catch (err: any) {
      throw new NotFoundException(err.message || 'Não foi possível excluir o endereço');
    }
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
