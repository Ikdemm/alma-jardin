import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns connected when mongoose is ready', async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: getConnectionToken(),
          useValue: { readyState: 1 },
        },
      ],
    }).compile();

    const service = moduleRef.get(HealthService);
    const result = await service.check();

    expect(result.status).toBe('ok');
    expect(result.mongo).toBe('connected');
    expect(result.service).toBe('alma-jardin-api');
  });
});
