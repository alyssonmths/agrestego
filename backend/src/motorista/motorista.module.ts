import { Module } from '@nestjs/common';
import { MotoristaService } from './motorista.service';
import { MotoristaController } from './motorista.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MotoristaController,],
  providers: [MotoristaService , PrismaService],
  exports: [MotoristaService]
})
export class MotoristaModule {}
