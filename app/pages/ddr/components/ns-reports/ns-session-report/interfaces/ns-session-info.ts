export interface SessionSummaryInterface
{
    scriptName:string;
    tried:string;
    success:string;
    fail:string;
    percentFail:string;
    min:string;
    average:string;
    max:string;
    median:string;
    percent80:string;
    percent90:string;
    percent95:string;
    percent99:string;
    status:string;
    statusName:string;
    generatorName :string;
}
export interface SessionInstanceInterface {
    // Script Name|Location|Access|Browser|User Id|Session Id|Child Index|Start Time|Absolute Start Time|Session Duration|Status Name
    scriptName:string;
    location:string;
    access:string;
    browser:string;
    userid:string;
    sessionid:string
    childindex:string;
    starttime:string;
    absstarttime:string;
    duration:string;
    status:string;
}
export interface SelectItem {
    label: string;
    value: any;
}
export interface SessionFailureInterface
{
    failureType:string;
    failure:string;
}
export interface SessionDetailInterface
{
    pageName:string;
    pageIndex:string;
    total:string;
    avgPageResp:string;
    thinkTime:string;
    avgPageRespPercent:string;
}
export interface SessionTimingInterface
{
    objName:string;
	status:string;
	httpCode:string;
	connReused:string;
	sslReused:string;
	startTime:string;
	totalTime:string;
	connectTime:string;
	sslTime:string;
	reqTime:string;
	firstByte:string;
	contentDownload:string;
	totalBytes:string;
	flowpath:string;
	fpSignature:string;
	instance:string;
	object:string;
	dnsLookup:string;
}
   