export class ExceptionData
{
    instrumentException : boolean;
    exceptionCapturing : boolean = false;
    exceptionTrace : boolean;
    exceptionTraceDepth : number = 9999;
    exceptionType : boolean;
}

//Contains exception filter Keyword variables
export class EnableSourceCodeFilters {
  advanceExceptionFilterId:number;
  advanceExceptionFilterPattern: string;
  advanceExceptionFilterMode:number;
  advanceExceptionFilterOperation:string;
  dupEntryMsg : string;
}

export class AdvanceException {
  enableExceptionCapture: boolean = false;
  enableVarCapture: VariableCapture;
  rate: number = 2;
  stackTraceDepth: number = 20;
  exceptionBlackList: string[] = [];
  enableLogs: boolean = true;
  objectValueSize: number = 1000;
  logBufferSize: number = 0;

}

export class VariableCapture {
  isClassVar: boolean = true;
  ismethodArg: boolean = true;
  ismethodLocal: boolean = true;
  isthreadLocalVar: boolean = true;
}