import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn()
            }
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token-mock')
          }
        }
      ]
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('deve registrar um novo usuário', async () => {
    const dadosUsuario = {
      name: 'Luana',
      email: 'luana@email.com',
      password: '123456'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // não existe ainda
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Luana',
      email: 'luana@email.com',
      role: 'USER'
    });

    const resultado = await service.registerUser(dadosUsuario);
    expect(resultado).toEqual({
      id: '1',
      name: 'Luana',
      email: 'luana@email.com',
      role: 'USER'
    });
  });

  it('deve validar a senha do usuário', async () => {
    const usuarioMock: User = {
      id: '1',
      name: 'Luana',
      email: 'luana@email.com',
      password: await bcrypt.hash('123456', 10),
      googleId: null,
      role: 'COMUM'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(usuarioMock);

    const usuario = await service.validateUser('luana@email.com', '123456');
    expect(usuario.email).toBe('luana@email.com');
  });

  it('deve fazer login do usuário e retornar token', async () => {
    const usuarioMock: User = {
      id: '1',
      name: 'Luana',
      email: 'luana@email.com',
      password: await bcrypt.hash('123456', 10),
      googleId: null,
      role: 'COMUM'
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(usuarioMock);

    const resultado = await service.login({ email: 'luana@email.com', password: '123456' });
    expect(resultado.access_token).toBe('token-mock');
  });
});
