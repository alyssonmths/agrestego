
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PassageiroService } from 'src/passageiro/passageiro.service';
import { JwtService } from '@nestjs/jwt';
import { MotoristaService } from 'src/motorista/motorista.service';
import { CreatePassageiroDto } from 'src/passageiro/dto/create-passageiro.dto';
import { CreateMotoristaDto } from 'src/motorista/dto/create-motorista.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly passageiroService: PassageiroService,
        private readonly motoristaService: MotoristaService,
        private readonly jwtService: JwtService
    ) { }

    async signUpPassageiro(createPassageiroDto: CreatePassageiroDto): Promise<{ passageiro: any, access_token: string }> {
        // Validar email duplicado
        const existingPassageiro = await this.passageiroService.findOne(createPassageiroDto.email);
        if (existingPassageiro) {
            throw new ConflictException('Email já cadastrado');
        }

        const existingMotorista = await this.motoristaService.findOne(createPassageiroDto.email);
        if (existingMotorista) {
            throw new ConflictException('Email já cadastrado');
        }

        // Criar passageiro
        const passageiro = await this.passageiroService.create(createPassageiroDto);

        // Gerar JWT
        const payload = {
            sub: passageiro.id,
            email: passageiro.email,
            role: 'passageiro',
        };

        const access_token = await this.jwtService.signAsync(payload);

        return { passageiro, access_token };
    }

    async signUpMotorista(createMotoristaDto: CreateMotoristaDto) {
        return await this.motoristaService.create(createMotoristaDto);
    }

    async signIn(email: string, pass: string): Promise<{ access_token: string, role: 'passageiro' | 'motorista' }> {
        let role: 'passageiro' | 'motorista' = 'passageiro';
        let user = await this.passageiroService.findOne(email);

        if (!user) {
            user = await this.motoristaService.findOne(email);
            role = 'motorista';
        }

        if (!user || user.senha !== pass) {
            throw new NotFoundException('Usuário ou senha inválidos');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role,
        };

        const access_token = await this.jwtService.signAsync(payload);

        return {
            access_token,
            role,
        };
    }


}
