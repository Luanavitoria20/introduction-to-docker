import { Test, TestingModule } from '@nestjs/testing';
import { FilmesController } from './filmes.controller';
import { FilmesService } from './filmes.service';
import { NotFoundException } from '@nestjs/common';

// aqui eu criei um serviço falso pra não precisar do banco
const fakeService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FilmesController', () => {
  let controller: FilmesController;
  let service: FilmesService;

  beforeEach(async () => {
    // monta o módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmesController],
      providers: [{ provide: FilmesService, useValue: fakeService }],
    }).compile();

    controller = module.get<FilmesController>(FilmesController);
    service = module.get<FilmesService>(FilmesService);
  });

  it('controller tem que existir', () => {
    expect(controller).toBeDefined();
  });

  // teste de criar filme
  it('criar um filme', async () => {
    const dto = { titulo: 'Matrix', genero: 'ACAO', ano: 1999 };
    fakeService.create.mockResolvedValue({ id: 1, ...dto });
    const result = await controller.create(dto as any);
    expect(result).toEqual({ id: 1, ...dto });
  });

  // listar todos
  it('listar todos os filmes', async () => {
    fakeService.findAll.mockResolvedValue([
      { id: 1, titulo: 'Matrix', genero: 'ACAO', ano: 1999 },
    ]);
    expect(await controller.findAll()).toEqual([
      { id: 1, titulo: 'Matrix', genero: 'ACAO', ano: 1999 },
    ]);
  });

  // buscar por id
  it('buscar um filme por id', async () => {
    const filme = { id: 1, titulo: 'Matrix', genero: 'ACAO', ano: 1999 };
    fakeService.findOne.mockResolvedValue(filme);
    const achado = await controller.findOne('1');
    expect(achado).toEqual(filme);
  });

  it('quando nao acha o filme deve dar erro', async () => {
    fakeService.findOne.mockResolvedValue(null);
    return expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });

  // atualizar
  it('atualizar um filme', async () => {
    const filmeOriginal = { id: 1, titulo: 'Matrix', genero: 'ACAO', ano: 1999 };
    const filmeAtualizado = { id: 1, titulo: 'Matrix Reloaded', genero: 'ACAO', ano: 2003 };
    fakeService.findOne.mockResolvedValue(filmeOriginal);
    fakeService.update.mockResolvedValue(filmeAtualizado);

    expect(await controller.update('1', { titulo: 'Matrix Reloaded', ano: 2003 } as any))
      .toEqual(filmeAtualizado);
  });

  it('erro ao tentar atualizar filme que nao existe', async () => {
    fakeService.findOne.mockResolvedValue(null);
    const dto = { titulo: 'Teste' };
    await expect(controller.update('999', dto as any)).rejects.toThrow(NotFoundException);
  });

  // remover
  it('remover um filme', async () => {
    const filme = { id: 1, titulo: 'Matrix', genero: 'ACAO', ano: 1999 };
    fakeService.findOne.mockResolvedValue(filme);
    fakeService.remove.mockResolvedValue(filme);

    const removido = await controller.remove('1');
    expect(removido).toEqual(filme);
  });

  it('nao deve remover se nao achar', async () => {
    fakeService.findOne.mockResolvedValue(null);
    return expect(controller.remove('999')).rejects.toThrow(NotFoundException);
  });
});
