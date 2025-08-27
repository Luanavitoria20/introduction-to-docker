import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('deve estar definido', () => {
    expect(usersController).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário', async () => {
      const dto: CreateUserDto = { name: 'João', email: 'joao@test.com', password: '123456' };
      (usersService.create as jest.Mock).mockResolvedValue({
        id: '1',
        ...dto,
      });

      const result = await usersController.create(dto);
      expect(result).toEqual({
        id: '1',
        ...dto,
      });
      expect(usersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const users = [
        { id: '1', name: 'João', email: 'joao@test.com' },
        { id: '2', name: 'Maria', email: 'maria@test.com' },
      ];
      (usersService.findAll as jest.Mock).mockResolvedValue(users);

      const result = await usersController.findAll();
      expect(result).toEqual(users);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo id', async () => {
      const user = { id: '1', name: 'João', email: 'joao@test.com' };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);

      const result = await usersController.findOne('1');
      expect(result).toEqual(user);
      expect(usersService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const updatedUser = { id: '1', name: 'João Atualizado', email: 'joao@test.com' };
      (usersService.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await usersController.update('1', { name: 'João Atualizado' });
      expect(result).toEqual(updatedUser);
      expect(usersService.update).toHaveBeenCalledWith('1', { name: 'João Atualizado' });
    });
  });

  describe('remove', () => {
    it('deve remover um usuário', async () => {
      (usersService.remove as jest.Mock).mockResolvedValue({ deleted: true });

      const result = await usersController.remove('1');
      expect(result).toEqual({ deleted: true });
      expect(usersService.remove).toHaveBeenCalledWith('1');
    });
  });
});
