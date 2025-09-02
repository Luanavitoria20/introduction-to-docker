import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token-mock'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('deve registrar um novo usuário', async () => {
      const dto = { name: 'Luana', email: 'luana@test.com', password: '123456' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue({ id: '1', name: 'Luana', email: 'luana@test.com', role: 'USER' });

      const result = await service.registerUser(dto);
      expect(result).toEqual({ id: '1', name: 'Luana', email: 'luana@test.com', role: 'USER' });
    });

    it('deve lançar conflito se email já existe', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'luana@test.com' });
      await expect(service.registerUser({ name: 'Luana', email: 'luana@test.com', password: '123456' }))
        .rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('deve validar usuário com senha correta', async () => {
      const userMock: User = { id:'1', name:'Luana', email:'luana@test.com', password: await bcrypt.hash('123456',10), googleId:null, role:'COMUM' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);

      const user = await service.validateUser('luana@test.com', '123456');
      expect(user.email).toBe('luana@test.com');
    });

    it('deve lançar Unauthorized se usuário não encontrado', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.validateUser('naoexiste@test.com', '123456')).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar Unauthorized se senha incorreta', async () => {
      const userMock: User = { id:'1', name:'Luana', email:'luana@test.com', password: await bcrypt.hash('123456',10), googleId:null, role:'COMUM' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);
      await expect(service.validateUser('luana@test.com','senhaerrada')).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar Unauthorized se usuário não tiver senha (Google)', async () => {
      const userMock: User = { id:'1', name:'Luana', email:'luana@test.com', password:null, googleId:'123', role:'COMUM' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);
      await expect(service.validateUser('luana@test.com','qualquer')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('deve fazer login e retornar token', async () => {
      const userMock: User = { id:'1', name:'Luana', email:'luana@test.com', password: await bcrypt.hash('123456',10), googleId:null, role:'COMUM' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);

      const result = await service.login({ email:'luana@test.com', password:'123456' });
      expect(result.access_token).toBe('token-mock');
    });
  });

  describe('findOrCreateGoogleUser', () => {
    it('deve criar usuário se não existir', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue({ id:'1', email:'luana@test.com', name:'Luana', googleId:'123' });

      const result = await service.findOrCreateGoogleUser({ googleId:'123', email:'luana@test.com', name:'Luana' });
      expect(result).toEqual({ id:'1', email:'luana@test.com', name:'Luana', googleId:'123' });
    });

    it('deve retornar usuário existente', async () => {
      const userMock = { id:'1', email:'luana@test.com', name:'Luana', googleId:'123' };
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(userMock);

      const result = await service.findOrCreateGoogleUser({ googleId:'123', email:'luana@test.com', name:'Luana' });
      expect(result).toEqual(userMock);
    });
  });
});
