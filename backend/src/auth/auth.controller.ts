import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { CreatePassageiroDto } from 'src/passageiro/dto/create-passageiro.dto';
import { CreateMotoristaDto } from 'src/motorista/dto/create-motorista.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup-passageiro')
    @ApiOperation({ summary: 'Criar conta de passageiro' })
    @ApiResponse({ status: 201, description: 'Passageiro criado com sucesso' })
    signUpPassageiro(@Body() createPassageiroDto: CreatePassageiroDto) {
        return this.authService.signUpPassageiro(createPassageiroDto);
    }

    @Post('signup-motorista')
    @ApiOperation({ summary: 'Criar conta de motorista' })
    @ApiResponse({ status: 201, description: 'Motorista criado com sucesso' })
    async create(@Body() createMotoristaDto: CreateMotoristaDto) {
        return this.authService.signUpMotorista(createMotoristaDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Autenticar usuário (passageiro ou motorista)' })
    @ApiResponse({ status: 200, description: 'Retorna token JWT' })
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }
}
