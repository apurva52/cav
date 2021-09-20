export interface BTCalloutInfoAgg
{
url:string;
urlID:number;
minCalloutCount:number;
maxCalloutCount:number;
totalCalloutCount:number;
minHttpCalloutCount:number;
maxHttpCalloutCount:number;
totalHttpCalloutCount:number;
minDBCalloutCount:number;
maxDBCalloutCount:number;
totalDBCalloutCount:number;
fpCount:number;

}

export interface BTCallOutInfoIndi
{
    backendName:string;
    backendID:string;
    minCount:number;
    maxCount:number;
    totalCount:number;
    minRespTime:number;
    maxRespTime:number;
    avgResponseTime:number;
    totalRespTime:number;

}