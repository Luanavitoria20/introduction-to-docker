import { ComumGuard } from './comum.guard';
import { ExecutionContext } from '@nestjs/common';

describe('ComumGuard', () => {
  let guard: ComumGuard;

  beforeEach(() => {
    guard = new ComumGuard();
  });

  it('deve permitir acesso se o usuário for COMUM', () => {
    const contextoMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'COMUM' }
        })
      })
    } as unknown as ExecutionContext;

    expect(guard.canActivate(contextoMock)).toBe(true);
  });

  it('deve negar acesso se o usuário não for COMUM', () => {
    const contextoMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'ADMIN' }
        })
      })
    } as unknown as ExecutionContext;

    expect(guard.canActivate(contextoMock)).toBe(false);
  });

  it('deve negar acesso se não houver usuário', () => {
    const contextoMock = {
      switchToHttp: () => ({
        getRequest: () => ({})
      })
    } as unknown as ExecutionContext;

    expect(guard.canActivate(contextoMock)).toBe(false);
  });
});
