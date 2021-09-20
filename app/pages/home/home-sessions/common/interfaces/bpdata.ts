export class BPData {
  completedBP: boolean;
  abandonedBP: boolean;
  bpExitPage: string;
  sessionExitPage: string;
  bpExitPageEvent: string;
  sessionExitPageEvent: string;
  transitPageEvent: string;
  bpName: string;
  useSIDExpiry: boolean;
  funnelCount: number;

  constructor() {
    this.bpName = null;
    this.completedBP = false;
    this.abandonedBP = false;
    this.bpExitPage = '';
    this.sessionExitPage = '';
    this.bpExitPageEvent = null;
    this.sessionExitPageEvent = null;
    this.transitPageEvent = null;
    this.useSIDExpiry = false;
    this.funnelCount = -1;
  }

}
