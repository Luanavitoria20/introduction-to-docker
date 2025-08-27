import { GoogleService } from './google-auth.service';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('google-auth-library');

describe('GoogleService', () => {
  let service: GoogleService;
  let authService: AuthService;
  let mockClient: any;

  beforeEach(() => {
    authService = {
      findOrCreateGoogleUser: jest.fn(),
      singJwtForUser: jest.fn()
    } as any;

    mockClient = {
      verifyIdToken: jest.fn()
    };

    (OAuth2Client as any).mockImplementation(() => mockClient);

    service = new GoogleService(authService);
  });

  it('deve lançar UnauthorizedException se payload for nulo', async () => {
    mockClient.verifyIdToken.mockResolvedValue({ getPayload: () => null });

    await expect(service.verify('token-falso')).rejects.toThrow(UnauthorizedException);
  });

  it('deve criar ou retornar usuário e gerar JWT', async () => {
    const payload = { sub: '123', email: 'teste@email.com', name: 'Luana' };
    mockClient.verifyIdToken.mockResolvedValue({ getPayload: () => payload });
    (authService.findOrCreateGoogleUser as jest.Mock).mockResolvedValue({ id: '1', email: payload.email, name: payload.name });
    (authService.singJwtForUser as jest.Mock).mockReturnValue('token-mock');

    const resultado = await service.verify('token-valido');

    expect(authService.findOrCreateGoogleUser).toHaveBeenCalledWith({
      googleId: '123',
      email: 'teste@email.com',
      name: 'Luana'
    });
    expect(authService.singJwtForUser).toHaveBeenCalled();
    expect(resultado).toBe('token-mock');
  });
});
