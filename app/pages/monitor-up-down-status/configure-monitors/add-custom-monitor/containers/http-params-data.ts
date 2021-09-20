
 export class HttpParamsData
 {
   host:string= ""; // host name
   port:number; // port with NF default port as 443
   protocol:string = "https"; // protocol should be http/htttps
   pHost:string= ""; //proxy host
   pPort:number;    //proxy port
   pUser:string= ""; //proxy username
   pPwd:string= ""; //proxy password
   baseUrl:string=""; 
   user:string="";
   pwd:string="";
   hstHdr:string="";       //Host Header
   urlTimeout:number;     //Default timeout if response is not fetched within 1 mins
   urlReadTimeout:number;    //Default timeout if response is not read within 1 mins
   reqType:string = "";
   reqBody:string="";
   mainBaseUrl:string="";
 }
    