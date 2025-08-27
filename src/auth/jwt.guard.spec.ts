import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('deve instanciar o guard', () => {
    expect(guard).toBeDefined();
  });
});
