export interface InfoData {
    title?: string;
    information?: string;
    button?:string;
    extraInfo?: string ;
    extraInfo1?: string ;
}

export class DialogActionInfo {
  action: string = null;
  subAction: string = null;
  data: InfoData;

  }
