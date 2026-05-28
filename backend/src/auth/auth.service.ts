
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassageiroService } from 'src/passageiro/passageiro.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly passageiroService: PassageiroService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<{access_token: string}> {
        const user = await this.passageiroService.findOne(username);

        if (user?.senha !== pass || !user) {
            throw new NotFoundException('Usuário ou senha inválidos');
        }

        const payload = { sub: user.id, email: user.email };

        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
