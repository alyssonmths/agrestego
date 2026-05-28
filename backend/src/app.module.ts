import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { PrismaService } from './database/prisma.service';
import { PassageiroModule } from './passageiro/passageiro.module';
import { MotoristaModule } from './motorista/motorista.module';
import { CorridaModule } from './corrida/corrida.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassageiroModule,
    MotoristaModule,
    CorridaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
