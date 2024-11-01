export type HealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE';

export type HealthKey = 'binders' | 'diskSpace' | 'mail' | 'ping' | 'livenessState' | 'readinessState' | 'db';

export interface Health {
  status: HealthStatus;
  components?: Partial<Record<HealthKey, HealthDetails>>;
}

export interface HealthDetails {
  status: HealthStatus;
  details?: Record<string, unknown>;
}
