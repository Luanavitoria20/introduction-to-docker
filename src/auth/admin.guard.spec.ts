import { AdminGuard } from './admin.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  it('deve permitir acesso se o usuário for ADMIN', () => {
    const contextoMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'ADMIN' }
        })
      })
    } as unknown as ExecutionContext;

    expect(guard.canActivate(contextoMock)).toBe(true);
  });

  it('deve negar acesso se o usuário não for ADMIN', () => {
    const contextoMock = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'COMUM' }
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
