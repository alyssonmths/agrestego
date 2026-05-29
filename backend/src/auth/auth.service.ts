
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassageiroService } from 'src/passageiro/passageiro.service';
import { JwtService } from '@nestjs/jwt';
import { MotoristaService } from 'src/motorista/motorista.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly passageiroService: PassageiroService,
        private readonly motoristaService: MotoristaService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(email: string, pass: string): Promise<{ access_token: string }> {
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

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
