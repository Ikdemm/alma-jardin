export type MongoStatus = 'connected' | 'disconnected';

export interface HealthResponse {
  status: 'ok' | 'degraded';
  mongo: MongoStatus;
  service: string;
  timestamp: string;
}
