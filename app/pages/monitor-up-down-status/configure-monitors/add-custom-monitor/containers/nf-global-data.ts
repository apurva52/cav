import { HttpParamsData } from "./http-params-data";

 export class NFGlobalData extends HttpParamsData
 {
   env:string = ""; //environment 
   idx:string ="";  // index pattern
   tier:string = ""; //tier from topology 
   query:string = ""; //query name
   sT:string = "";    //start time
   eT:string = "";    //end time
 }