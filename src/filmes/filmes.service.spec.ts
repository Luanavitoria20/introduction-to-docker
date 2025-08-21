import { Test, TestingModule } from "@nestjs/testing";
import { FilmesService } from "./filmes.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

// Mock do PrismaService
const mockPrisma = {
  filme: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}; 

// Suite de testes para FilmesService
describe("FilmesService", () => {
  let service: FilmesService;

  // Criar instância do service antes de cada teste
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FilmesService>(FilmesService);
  });

  // Teste de criação
  it("deve criar um filme", async () => {
    const dto = { titulo: "Matrix", ano: 1999 };
    mockPrisma.filme.create.mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto as any);
    expect(result).toEqual({ id: 1, ...dto });
    expect(mockPrisma.filme.create).toHaveBeenCalledWith({ data: dto });
  });

  // Teste de listagem
  it("deve listar todos os filmes", async () => {
    const filmes = [{ id: 1, titulo: "Matrix", ano: 1999 }];
    mockPrisma.filme.findMany.mockResolvedValue(filmes);

    expect(await service.findAll()).toEqual(filmes);
  });

  // Teste de busca por id
  it("deve retornar um filme por ID", async () => {
    const filme = { id: 1, titulo: "Matrix", ano: 1999 };
    mockPrisma.filme.findUnique.mockResolvedValue(filme);

    expect(await service.findOne(1)).toEqual(filme);
  });

  // Teste de erro quando não encontrado
  it("deve lançar erro se filme não encontrado", async () => {
    mockPrisma.filme.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // Teste de atualização
  it("deve atualizar um filme", async () => {
    const updated = { id: 1, titulo: "Matrix Reloaded", ano: 2003 };
    mockPrisma.filme.findUnique.mockResolvedValue({ id: 1, titulo: "Matrix", ano: 1999 });
    mockPrisma.filme.update.mockResolvedValue(updated);

    expect(await service.update(1, { titulo: "Matrix Reloaded", ano: 2003 })).toEqual(updated);
  });

  // Teste de remoção
  it("deve remover um filme", async () => {
    const removed = { id: 1, titulo: "Matrix", ano: 1999 };
    mockPrisma.filme.findUnique.mockResolvedValue(removed);
    mockPrisma.filme.delete.mockResolvedValue(removed);

    expect(await service.remove(1)).toEqual(removed);
  });
})