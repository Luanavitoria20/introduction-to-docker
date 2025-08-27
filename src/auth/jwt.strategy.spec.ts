import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('deve validar o payload e retornar userId, email e role', async () => {
    const payload = { userId: '1', email: 'teste@email.com', role: 'COMUM' };

    const resultado = await strategy.validate(payload);

    expect(resultado.userId).toBe('1');
    expect(resultado.email).toBe('teste@email.com');
    expect(resultado.role).toBe('COMUM');
  });
});
