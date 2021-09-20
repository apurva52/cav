export class CHECKMONITORDATA { 
   //  check-mon-name:string;
  phaseName: string = "NA";
  periodicity: string="NA";
  count: string = "NA";
  endPhaseName:string = "NA";
  checkMonProgName: string;
  fromEvent: string ="NA";
  fromEvent_ui:string = "NA";
  frequency: string="2";
  frequency_ui:string = "Never";
  endEvent: string = "NA";
  endEvent_ui:string = "NA";
  name:string;
  instance:string;

  //for batch jobs
  //  added for Batch Jobs
  batchSearchPattern: string = "NA";
  logFile: string = "NA";
  cmdName:string = "NA";
  successCriteria:string="1";  
 //These fields are added for future purpose.
  future1:string = "NA";
  future2:string = "NA";
  future3:string = "NA";
  future4:string = "NA";
  future5:string = "NA";
  future6:string = "NA";
}