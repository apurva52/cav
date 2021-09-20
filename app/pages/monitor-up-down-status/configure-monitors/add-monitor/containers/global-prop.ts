 
export class GlobalProps
{
//  prop:any={};
 instName:string = "NA";
 host:string= '';
 url:string ='';
 user:string ='';
 pwd:string='';
 arguments:string = "NA";
 pingPkt:number =5;   
 pingIntrvl:number = 0.2;
 pingTP :number = 32;
 sockeTo:number = 10;
 socketTP:string = "5";
 httpUrl:string ='';
 httpUser:string;
 httpPwd:string;
 httpTP:number=64;
 httpSc:string= "2xx";
 httpCTO:number = 10;
 httpRTO:number = 30;
 useProxy:boolean = false;
 mURL:string = "";  // url for maintenance settings
 mHost:string = "";  // host for maintenance settings
 mPort:string = "";  // port for maintenance settings
 mPro:string = "";   // protocol for maintenance settings
 pingInterval = 1;  // ping interval added for modified healthcheck UI
 httpInterval = 1;  // httl interval added for modified healthcheck UI
 sktInterval = 1;  // socket interval added for modified healthcheck UI

}