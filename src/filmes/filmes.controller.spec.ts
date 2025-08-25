import { Test, TestingModule } from '@nestjs/testing';
import { FilmesController } from './filmes.controller';
import { FilmesService } from './filmes.service';
import { NotFoundException } from '@nestjs/common';

const mockFilmesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FilmesController', () => {
  let controller: FilmesController;


  beforeEach(async () => {
  
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmesController],
      providers: [
        { provide: FilmesService, useValue: mockFilmesService },
      ],
    }).compile();

    controller = module.get<FilmesController>(FilmesController);

  });

  // Deve criar 
  it('deve criar um filme', async () => {
    const dto = { titulo: 'Matrix', ano: 1999 };
    mockFilmesService.create.mockResolvedValue({ id: 1, ...dto });
    expect(await controller.create(dto as any)).toEqual({ id: 1, ...dto });
  });

  // Deve listar todos
  it('deve listar todos os filmes', async () => {
    const list = [{ id: 1, titulo: 'Matrix', ano: 1999 }];
    mockFilmesService.findAll.mockResolvedValue(list);
    expect(await controller.findAll()).toEqual(list);
  });

  // Deve buscar pelo ID
  it('deve buscar um filme por ID', async () => {
    const filme = { id: 1, titulo: 'Matrix', ano: 1999 };
    mockFilmesService.findOne.mockResolvedValue(filme);
    expect(await controller.findOne('1')).toEqual(filme);
  });

  // Deve atualizar
  it('deve atualizar um filme', async () => {
    const updated = { id: 1, titulo: 'Matrix Reloaded', ano: 2003 };
    mockFilmesService.update.mockResolvedValue(updated);
    expect(await controller.update('1', { titulo: 'Matrix Reloaded', ano: 2003 } as any)).toEqual(updated);
  });

  // Deve remove
  it('deve remover um filme', async () => {
    const removed = { id: 1, titulo: 'Matrix', ano: 1999 };
    mockFilmesService.remove.mockResolvedValue(removed);
    expect(await controller.remove('1')).toEqual(removed);
  });


});
