export class AdvanceMetricConf
 {
    dF:string= '';// derived Formula
    advPattern : PatternVal[] = [];
    id:number=0;
}

export class PatternVal{
   pattern:string = ''; // pattern value
   upVal: string = ''; // updated value
   id:number=0;
}