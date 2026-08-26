import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { HealthResponse } from '@alma-jardin/shared';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async check(): Promise<HealthResponse> {
    const mongoState = this.connection.readyState;
    const mongo = mongoState === 1 ? 'connected' : 'disconnected';

    return {
      status: mongo === 'connected' ? 'ok' : 'degraded',
      mongo,
      service: 'alma-jardin-api',
      timestamp: new Date().toISOString(),
    };
  }
}
