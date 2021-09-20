import { SelectItem } from 'primeng';

export interface MetricIndices {
  tire: SelectItem[];
  server: SelectItem[];
  instance: SelectItem[];
  pages: SelectItem[];
}
export interface hierarchicalPayload {

  opType: number,
  tr: number,
  cctx: {
    cck: string,
    pk: string,
    u: string,
    prodType: string
  },
  duration: {
    st: number,
    et: number,
    preset: string
  },
  clientId: string,
  appId: string,
  glbMgId: string,
  subject: {
    tags: [
      {
        key: string,
        value: string,
        mode: number
      }

    ]
  }

}

export interface hierarchicalData {

}
