import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google-auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let googleService: GoogleService;

  beforeEach(() => {
    authService = {
      registerUser: jest.fn(),
      login: jest.fn()
    } as any;

    googleService = {
      verify: jest.fn()
    } as any;

    controller = new AuthController(authService, googleService);
  });

  it('deve registrar um usuário', async () => {
    const dto = { name: 'Luana', email: 'teste@email.com', password: '123456' };
    (authService.registerUser as jest.Mock).mockResolvedValue({ id: '1', name: 'Luana', email: 'teste@email.com', role: 'COMUM' });

    const resultado = await controller.registerUser(dto);

    expect(authService.registerUser).toHaveBeenCalledWith(dto);
    expect(resultado.id).toBe('1');
  });

  it('deve logar usuário', async () => {
    const dto = { email: 'teste@email.com', password: '123456' };
    (authService.login as jest.Mock).mockResolvedValue({ access_token: 'token-mock' });

    const resultado = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(resultado.access_token).toBe('token-mock');
  });

  it('deve logar usuário via Google', async () => {
    const body = { idToken: 'token-google' };
    (googleService.verify as jest.Mock).mockResolvedValue('token-mock-google');

    const resultado = await controller.loginWithGoogle(body);

    expect(googleService.verify).toHaveBeenCalledWith('token-google');
    expect(resultado.access_token).toBe('token-mock-google');
  });
});
