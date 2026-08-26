import type { HealthResponse } from './health';

describe('HealthResponse', () => {
  it('accepts a valid health payload shape', () => {
    const payload: HealthResponse = {
      status: 'ok',
      mongo: 'connected',
      service: 'alma-jardin-api',
      timestamp: new Date().toISOString(),
    };

    expect(payload.status).toBe('ok');
    expect(payload.mongo).toBe('connected');
  });
});
