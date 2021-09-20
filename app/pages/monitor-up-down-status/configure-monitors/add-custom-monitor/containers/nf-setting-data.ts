import { HttpParamsData } from "./http-params-data";

 export class NFSettings extends HttpParamsData
 {
   env:string = ""; //environment 
   idx:string ="";  // index pattern
   tier:string = "";
   query:string = "";
   sT:string = "";    //start time
   eT:string = "";    //end time
 }