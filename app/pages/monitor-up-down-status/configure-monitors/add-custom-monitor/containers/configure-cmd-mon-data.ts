  // import { AdvSettings } from "./adv-settings.data";
// import { GdfInfo } from "./gdf-info-data";

import { AdvanceMetricConf } from "src/app/pages/generic-gdf/containers/adv-metric-configuration-data";
import { MetricHierarchyData } from "src/app/pages/generic-gdf/containers/metric-hierarchy-data";

// import { RemoteConnectionData } from "./remote-connection-data";
export class CmdMonData {
      monN: string = ""; // Custom Mon Name
      opt: string = ""; // Options
      inpType: string = "cmd" // whether it is command or script 
      inputOpt: string = ''; // input value of command/script 
      cmdScript: string = ''; // input value of command/script 
      oType: string = '1'; //Output type (string-1/keyValue-2/JSON-3/JMX-4) of configured monitor
      delimiter: string = ' '; //delimiter can be space, commma, pipe, tab and so on..
      //adv: AdvSettings = new AdvSettings;
      gdfInfo: GdfInfo = new GdfInfo;
      oN: string = '';
      cD: string = ''; //custom delimiter
      output: string = ''; // output of the command
      hl: number; //headerLine 
      skipLineTop: string = '' // to hold dropdown value for skip line top
      skipLineBottom: string = ''; //   to hold dropdown value for skip line from bottom
      top: number; // skip line from top
      topActionStr: string = ''; // command to skip line from top
      bottom: number; // skip line from bottom
      bottomActionStr: string = ''; // command to skip line from bottom
      cat: string = "system"; //category name by default it will be Command Monitor
      //rCon :RemoteConnectionData= new RemoteConnectionData;
      tier: boolean = true; // tier 
      rCon:RemoteConnectionData = new RemoteConnectionData;
      server: boolean = true; // server
      rChar:string;//configure characters which user want to replace it with underscore (_).
      serverIp = '127.0.0.1'
    //let osType = this.getOSType(this.serverNameList.indexOf(this._serverForRunCmd));
      os = 'LinuxEx';
      cusCat: string = "";
     
      
}
export class RemoteConnectionData {
      host: string = ""; // host
      port: number = 22; // port
      user: string = ""; // username
      pwd: string = ""; //pwd
      pubKey: string = ""; // public key
      prvKey: string = ""; //private key
      passphrase: string = ""; //passphrase hidden
      pHost: string = ""; //proxy host
      pPort: number = 3128; // proxy port
      pUser: string = ""; // proxy user
      proxyPwd: string = ""; // proxy pwd
      
      rT:string = ""; // remote tier
      rS:string = ""; // remote server display name
      rSDpName:string = "";
      executeRemote:boolean =false;
      cT:string = "";
  
      //DB UI Parameters
      tsf:string = ""; // Trust Store File-path
      tsp:string = ""; // Trust Store Password
      tst:string = ""; // Trust Store Password
      ksf:string = ""; // Key Store File-path
      ksp:string = ""; // Key Store password
      
      dbName:string = ""; //  Database name
      query:string = ""; // query
      sslType: string = ""; // ssl Type
      auth:string = "0"; // auth for oracle
      sid: string = ""; // sid 
      custSSL:string = "";    //custom ssl type
  
      //JMX UI Parameters
      connURL: string;     //JMX Connection URL
      sslEnable: boolean = false;
      otherConn: string;
      pid: string; //process ID
      pidFile: string; //process ID File
      occCount: number = 1; //Occurence count
  }
  export class GdfInfo
 {
    grpN:string = ""; // Group Name
    gI:number = -1; // Group ID(In case of 'add' it will be -1 and in 'edit' it would be number of the gdf group id.
    gT:string = "vector"; // Group Type Sample,Rate,Cumulative,times,timesstd
    nM:number = -1; // Num of metrics (graph)
    nV:number = -1; // Num of vectors
    mV:string = "Application Metrics"; //to be changed 
    mD:string = ""; // Metric hirecharchy (metaData)
    gD:string = ""; // Group Description
    metricInfo : MetricInfoData[] = []; //Metric information
    depMHComp:MetricHierarchyData[] = [];
    cusCat:string = ""
 }
 export class MetricInfoData
{
      graph:string = "Graph";
      graphNm :string = ""; // Graph Name
      gId:number;// Graph ID
      gT:string = "scalar"; // Graph Type
      dT:string = "times"; // Data Type
      gI:number; // Graph Data Index
      fL:string = "NA"; // Formula
      nV:string = "0"; // Num Vectors
      gS:string = "NA"; // Graph State
      pI:string = "-1"; // PDf ID
      pDI:string = "-1"; // Percentile Data Index
      f2:string = "NA"; // Future 2
      f3:string = "NA"; // Future 3
      gD:string = ""; 
      dC:string = ""; // Dependent Component
      depMConf:AdvanceMetricConf[] = []; //Metric Dependent component
      unit:string="";  //units for graph 

}

 