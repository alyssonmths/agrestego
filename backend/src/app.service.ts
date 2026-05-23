import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {

  constructor(private service: PrismaService) {}

  getUsers() {
    return this.service.passageiro.findMany();
  }

  createUser() {
    return this.service.passageiro.create({
      data: {
        nome: 'John Doe',
        email: 'john.doe@example.com',
        senha: 'password123',
        celular: '1234567890',
      }
    });
  }
}