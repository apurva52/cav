import { Legend } from 'src/app/shared/legend/legend.model';

export interface NodeActionSidebarData {
  details?: TierDetails[];
  relations?: TierRelations;
}

export interface TierDetails {
  label?: string;
  legend?: Legend[];
}

export interface TierRelations {
  applications: Relations;
  tiers: Relations;
  servers: Relations;
  instances: Relations;
  ipPoint: Relations;
}

export interface Relations {
  label?: string;
  legend?: Legend[];
}
