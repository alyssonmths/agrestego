import { Test, TestingModule } from "@nestjs/testing";
import { PassageiroService } from "./passageiro.service";
import { PrismaService } from "src/database/prisma.service";
import { Endereco } from "generated/prisma/client";

describe('PassageiroService - Testes do Grupo (Alysson)', () => {
    let service: PassageiroService;

    let prisma: {
        endereco: {
            findUnique: jest.Mock,
            delete: jest.Mock;
        };
    };

    beforeEach(async () => {
        prisma = {
            endereco: {
                findUnique: jest.fn(),
                delete: jest.fn(),
            }
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PassageiroService,
                {
                    provide: PrismaService,
                    useValue: prisma,
                },
            ],
        }).compile();

        service = module.get<PassageiroService>(PassageiroService);
    });

    it('CT-G-04: deve lançar erro quando endereço não for encontrado', () => {
        const userId = 10;
        const enderecoId = 11;

        prisma.endereco.findUnique.mockResolvedValue(null);

        expect(service.deleteEndereco(userId, enderecoId)).rejects.toThrow(Error);
        expect(prisma.endereco.findUnique).toHaveBeenCalled();
        expect(prisma.endereco.delete).not.toHaveBeenCalled();
    });

    it('CT-G-04: deve lançar erro quando userId for diferente do passageiroId pertencente ao endereço', () => {
        const userId = 10;
        const enderecoId = 11;

        const enderecoMock: Partial<Endereco> = {
            id: enderecoId,
            passageiroId: 20,
        };

        prisma.endereco.findUnique.mockResolvedValue(enderecoMock);

        expect(service.deleteEndereco(userId, enderecoId)).rejects.toThrow(Error);
        expect(prisma.endereco.findUnique).toHaveBeenCalled();
        expect(prisma.endereco.delete).not.toHaveBeenCalled();
    });
});