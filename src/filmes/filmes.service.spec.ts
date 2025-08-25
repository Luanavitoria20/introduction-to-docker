import { Test, TestingModule } from "@nestjs/testing";
import { FilmesService } from "./filmes.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

// fake do Prisma só pra enganar no teste
const fakePrisma = {
  filme: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}; 

describe("FilmesService", () => {
  let service: FilmesService;

  beforeEach(async () => {
    // aqui monta o módulo mas usando o fake em vez do banco
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmesService,
        { provide: PrismaService, useValue: fakePrisma },
      ],
    }).compile();

    service = module.get<FilmesService>(FilmesService);
  });

  // criar filme
  it("criar filme", async () => {
    const dto = { titulo: "Matrix", ano: 1999 };
    fakePrisma.filme.create.mockResolvedValue({ id: 1, ...dto });

    const criado = await service.create(dto as any);
    expect(criado).toEqual({ id: 1, ...dto });
    // só pra conferir se chamou certo
    expect(fakePrisma.filme.create).toHaveBeenCalledWith({ data: dto });
  });

  // listar
  it("listar filmes", async () => {
    const lista = [{ id: 1, titulo: "Matrix", ano: 1999 }];
    fakePrisma.filme.findMany.mockResolvedValue(lista);

    const result = await service.findAll();
    expect(result).toEqual(lista);
  });

  // buscar por id
  it("buscar por id", async () => {
    const filme = { id: 1, titulo: "Matrix", ano: 1999 };
    fakePrisma.filme.findUnique.mockResolvedValue(filme);

    const achado = await service.findOne(1);
    expect(achado).toEqual(filme);
  });

  // quando não acha
  it("erro se nao achar filme", async () => {
    fakePrisma.filme.findUnique.mockResolvedValue(null);

    return expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // atualizar
  it("atualizar filme", async () => {
    const filmeVelho = { id: 1, titulo: "Matrix", ano: 1999 };
    const filmeNovo = { id: 1, titulo: "Matrix Reloaded", ano: 2003 };
    fakePrisma.filme.findUnique.mockResolvedValue(filmeVelho);
    fakePrisma.filme.update.mockResolvedValue(filmeNovo);

    const atualizado = await service.update(1, { titulo: "Matrix Reloaded", ano: 2003 });
    expect(atualizado).toEqual(filmeNovo);
  });

  // remover
  it("remover filme", async () => {
    const filme = { id: 1, titulo: "Matrix", ano: 1999 };
    fakePrisma.filme.findUnique.mockResolvedValue(filme);
    fakePrisma.filme.delete.mockResolvedValue(filme);

    const removido = await service.remove(1);
    expect(removido).toEqual(filme);
  });
});
