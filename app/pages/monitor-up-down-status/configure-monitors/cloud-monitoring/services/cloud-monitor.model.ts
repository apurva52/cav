import { ClientCTX } from 'src/app/core/session/session.model';
export interface CloudMonitorPayload {
    cctx?: ClientCTX;
    tr?: number;
    sp?: string;
  }