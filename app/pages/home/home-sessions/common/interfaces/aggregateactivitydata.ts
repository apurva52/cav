export class AggregateActivityData {
    actionName: string;
    avgDuration: any;
    count: number;
    failedCount: number;
    type : string;
  
    constructor(actionName, avgDuration, count, failedCount,type)
    {
      this.actionName = actionName;
      this.avgDuration = avgDuration;
      this.count = count;
      this.failedCount = failedCount;
      switch(type){
        case 0:
          this.type = "Mark";
          this.avgDuration = "-";
          break;
        case 1:
          this.type = "Measure";
          break;
        case 2:
          this.type = "Action";
          break;
        case 3:
          this.type = "Transaction";
          break;
     }
    }
  }
  