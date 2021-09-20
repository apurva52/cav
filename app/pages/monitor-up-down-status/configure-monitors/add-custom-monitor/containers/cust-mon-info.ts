// import { NFAdvanceData } from './nf-advance.data';
// import { NFGdfData } from './nf-gdf.data';
// import { NFGlobalData } from './nf-global-data';
// import { NFSettings } from './nf-setting-data';

import { NFAdvanceData } from "./nf-advance.data";
import { NFGdfData } from "./nf-gdf.data";
import { NFGlobalData } from "./nf-global-data";

export class CustMonInfo
{
  mode:number; // 0 - NF Mon, 1 - Cmd
  monN:string = ""; // Custom Mon Name
  oN:string = ""; // Old Custom Mon Name (if user changes metric grpName in edit mode so it'll override the name)
  opt:string = ""; // Options
  mdata:string = "";
  ins:string = "" ;// InstanceName
  pN:string = "cm_generic_rest_monitor"; // Program Name
  rO:string = ""; //RunOnce
  gN:string = ""; //Gdf Name
  enbl:string = "false"; //Enable /Disable
  uA:string = ""; //UserAgent
  cfp:string = ""; //Config File path
  dvm:string = ""; //DVM
  aN:string = ""; // App Name
  jH:string = ""; //Java Home
  jC:string = ""; //Java Class Path
  typ:string = ""; //Type
  aT:string = ""; //Agent type
  d:number = 0;
  dv:number= 0;
  r:number =60;
  pT:string= "java";
  aM:string="";

  select:boolean = false; //saved query checkbox value
  sq: string = ""; 
  
  adv:NFAdvanceData=new NFAdvanceData();
  gdfInfo:NFGdfData=new NFGdfData();
  nf:NFGlobalData= new NFGlobalData();
}