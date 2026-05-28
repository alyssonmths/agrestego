import { Injectable } from '@nestjs/common';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class MotoristaService {
  constructor(private readonly prisma: PrismaService){ }

  create(createMotoristaDto: CreateMotoristaDto) {
    return this.prisma.motorista.create({
      data: createMotoristaDto,
    });
  }
  findAll(){
    return this.prisma.motorista.findMany();
  }

  findOne(id: number) {
    return this.prisma.motorista.findUnique({where: {id}});
  }
  update( id: number, updateMotoristaDto: UpdateMotoristaDto){
    return this.prisma.motorista.update({where: {id}, data: updateMotoristaDto});
  }

  remove(id: number){
    return this.prisma.motorista.delete({where: {id}});
  }
 
}