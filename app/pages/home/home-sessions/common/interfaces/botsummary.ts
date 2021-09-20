export class BOTSummary
{
  botScore:number;
  automationFramework:boolean;
  botUserAgent:boolean;
  browserExtensionPresent:boolean;
  avgPageTime:string;
  avgGapTime:string;
  nonTrustedEvents:number;
  botActions:number;
  nonTrustedEventsPct:string;
  botActionsPct:string;


  constructor(data)
  {
    try {
   
     //TODO: we need to keep this logic in sync with what we have in backend 
     this.botScore = data.botScore;
     this.automationFramework = data.automationFrameworkPresent;
     this.botUserAgent = data.botUserAgent;
     this.browserExtensionPresent = data.browserExtPresent;
     if(isNaN(data.totalTimeSpent/data.totalPage))
       this.avgPageTime = "0";
     else
       this.avgPageTime = (data.totalTimeSpent/data.totalPage).toFixed(2);

     if(isNaN(data.totalGapBetweenAction/data.totalNextAction))
       this.avgGapTime = "0";
     else
       this.avgGapTime = (data.totalGapBetweenAction/data.totalNextAction).toFixed(2);

     if(isNaN((data.totalNonTrustedEvent/data.totalEventCount) * 100))
       this.nonTrustedEventsPct = "0";
     else
       this.nonTrustedEventsPct = ((data.totalNonTrustedEvent/data.totalEventCount) * 100).toFixed(2);

     if(isNaN((data.totalFocusNotChangeBetweenAction/data.totalEventCount) * 100))
       this.botActionsPct = "0";
     else
       this.botActionsPct = ((data.totalFocusNotChangeBetweenAction/data.totalEventCount) * 100).toFixed(2);

     this.nonTrustedEvents =  data.totalNonTrustedEvent;
     this.botActions = data.totalFocusNotChangeBetweenAction;


    }
    catch(e)
    {
      console.log("Error processing Bot Data" + e);
    }
  }


}

