import { ClientCTX } from 'src/app/core/session/session.model';
export interface CustomMonitorPayload {
    cctx?: ClientCTX;
    tr?: number;
    sp?: string;
  }