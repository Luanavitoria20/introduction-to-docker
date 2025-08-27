import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário', async () => {
      const dto = { name: 'João', email: 'joao@test.com', password: '123456' };
      const createdUser = { id: '1', ...dto };

      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await service.create(dto);
      expect(result).toEqual(createdUser);
      expect(prisma.user.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [
        { id: '1', name: 'João', email: 'joao@test.com' },
        { id: '2', name: 'Maria', email: 'maria@test.com' },
      ];

      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo id', async () => {
      const user = { id: '1', name: 'João', email: 'joao@test.com' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updated = { id: '1', name: 'Novo', email: 'novo@test.com' };
      mockPrisma.user.update.mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Novo' });
      expect(result).toEqual(updated);
      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { name: 'Novo' } });
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      mockPrisma.user.update.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Novo' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um usuário', async () => {
      const removed = { id: '1', name: 'Apagado', email: 'apagado@test.com' };
      mockPrisma.user.delete.mockResolvedValue(removed);

      const result = await service.remove('1');
      expect(result).toEqual(removed);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      mockPrisma.user.delete.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
