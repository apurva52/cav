

export interface conversionReportTable {
    funnelData?: FunnelData[];
  }
  export interface FunnelData {
    dec1: string;
    count1: number;
    count2: number;
    dec2: string;
    percentage: string;
    dec3: string;
    count3: number;
  
  }
  
  // export interface FunnelData {
  //   pageName: string;
  //   totalEntries: number;
  //   entryPage: EntryPage;
  //   exitPage: ExitPage;
  // }
  
  // export interface EntryPage {
  //   totalEntryCount: number;
  //   entryCountPct: number;
  //   entryDetails: any;
  //   bgColor: string;
    
  // }
  
  // export interface ExitPage {
  //   totalExitCount: number;
  //   exitCountPct: number;
  //   exitDetails: any;
  //   bgColor: string;
  // }