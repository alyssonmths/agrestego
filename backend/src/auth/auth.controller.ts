import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { CreatePassageiroDto } from 'src/passageiro/dto/create-passageiro.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup-passageiro')
    signUpPassageiro(@Body() createPassageiroDto: CreatePassageiroDto) {
        return this.authService.signUpPassageiro(createPassageiroDto);
    }

    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }
}
