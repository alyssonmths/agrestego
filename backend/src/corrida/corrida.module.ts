import { Module } from '@nestjs/common';
import { CorridaService } from './corrida.service';
import { CorridaController } from './corrida.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CorridaController],
  providers: [CorridaService, PrismaService],
})
export class CorridaModule {}
