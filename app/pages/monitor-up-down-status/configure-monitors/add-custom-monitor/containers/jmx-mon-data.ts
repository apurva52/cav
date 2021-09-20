//import { GdfInfo } from "./gdf-info-data";

import { GdfInfo } from "./configure-cmd-mon-data";

//import { GdfInfo } from "../configure-cmd-monitor/service/configure-cmd-mon-data";


export class JMXMonData {
  monN:string = "";
  oN: string = "";
  gdfInfo: GdfInfo = new GdfInfo;
  cat: string = "system";
  objName: string; //object name for writing in config json
  bsPath: string = "";  //base path
  operator:string;
  metricKey:string;
  filterVal:string;
  objNameUI:string; //for showing object name in UI
  cusCat:string = "";
  connParams = new JMXConnectionParams();
}

export class JMXConnectionParams{
  host: string;
  port: string;
  user: string; // user name
  pwd: string; // password
  tsf: string; // Trust Store File-path
  tsp: string; // Trust Store Password
  tst: string; //trsut store type
  ksf: string; // Key Store File-path
  ksp: string; // Key Store password
  tier: string = ''; // tier
  server: string = ''; // server
  instance: string;    //instance Cmon/BCI
  sslEnable: boolean = false;
  connURL: string;     //JMX Connection URL
  otherConn: string;
  pid: string; //process ID
  pidFile: string; //process ID File
  searchPattern: any[] = []; //Search pattern
  occCount: number = 1; //Occurence count
  custInstance: string;   //custom instance in case of cmon
  manualEntry:boolean = false;  //used if user add metrices manually
}