import { Module } from '@nestjs/common';
import { PassageiroService } from './passageiro.service';
import { PassageiroController } from './passageiro.controller';
import { PrismaService } from 'src/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { MotoristaModule } from 'src/motorista/motorista.module';

@Module({
 imports: [
    JwtModule.register({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '1d' }
    }),
    MotoristaModule
],
 
  controllers: [PassageiroController],
  providers: [PassageiroService, PrismaService],
  exports: [PassageiroService],
  
})
export class PassageiroModule {}
