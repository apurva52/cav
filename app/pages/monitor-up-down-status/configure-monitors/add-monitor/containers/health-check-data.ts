export class HealthCheckMonData
{
  map(arg0: (each: any) => {}): any {
    throw new Error('Method not implemented.');
  }
 prop :any= {};
 packet:number;
 interval:number ;
 proxyUrl:string;
 userName:string;
 pwd:string;
 statusCode:string;
 threadPool:number;
 timeOut:number;
 tierServerType:string = "";
 tierName:string = "";
 serverName:string = "";
 healthCheckType:string = "Ping";
 customTierName:string;
 customServerName:string;
 enableTier:boolean=false;
 enableServer:boolean = false;
 instanceName:string;
 host:string;
 port:number;


 instName:string ='';

 pingPkt:number;
 pingIntrvl:number;
 sockeTo:number;
 socketTP:string;
 httpUrl:string;
 httpUser:string;
 httpPwd:string;
 httpTP:number;
 httpSc:string; 
 arguments:string = "false";


useProxy:boolean= false;
overideGlobalSettings:boolean = false;
instNameHttp:string;
enableHealthCheckMon:boolean;

url:string;
user:string;

httpCTO:number;
httpRTO:number;
patternEnable:boolean=false;

httpsEnable: boolean = false;
portForURL:number;

cntMatch:string = "0";       // Content Matching
srchStr:string;     // Search String
srchPttrn:string;       // Search Pattern
method:string = "get";       //Method (get/post)
postMthd:string;        // if user selects post in method dropdown
header:string = "";      // header "key:value;key1:val1"
cert:boolean = false;       //is certified

keyStrFile:string;      //keystoreFile
keyStrPwd:string;       //keystorePassword
trstStrFile:string;     //truststoreFile
trstStrPwd:string;      //truststorePassword
availonMatch:boolean = false;        //isAvailOnNotMatch (service is available content validation)
pingInterval:number = 1;  // ping interval added for modified healthcheck UI
httpInterval:number = 1;  // httl interval added for modified healthcheck UI
sktInterval:number = 1;  // socket interval added for modified healthcheck UI



}
