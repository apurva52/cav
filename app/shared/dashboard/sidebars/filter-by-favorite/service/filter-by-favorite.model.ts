import { SelectItem } from 'primeng';

export interface FilterData {
  label: String;
  options: SelectItem[];
}

export interface ParametersData {
  data?: any[];
  tier : SelectItem[];
  server: SelectItem[];
  instance: SelectItem[];
}

export interface hierarchicalPayload {

  opType: number,
  tr: string,
  cctx: Object,
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

      ]
  }

}
