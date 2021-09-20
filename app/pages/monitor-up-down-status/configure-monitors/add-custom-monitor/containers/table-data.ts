 //import { GdfTableData} from '../containers/gdf-table-data';
//import { AdvSettings } from './adv-settings.data';
import { RemoteConnectionData } from './configure-cmd-mon-data';
import { GdfTableData } from './gdf-table-data';
//import { RemoteConnectionData } from './remote-connection-data';

 export class TableData
 {
   id:number;
   serverName:string;
   arguments:string; //field used for showing data to UI
   options:string;   //field used for sroring argumnet to be send to server
   oldOptions:string;   //field used for sroring argumnet to be send to server
   appName:string="default";
   excludeAppName:string= "";
   javaHome:string;
   classPath:string;  
   compValWithId:Object;//field used to storing data mapped with its id,used for edit purpose,
   instance:string;
   
   //Use As Option
   useAsOption: string = '';
   useAsOldOption: string = '';
      
   name:string;
   type:number;

  //  check-mon-name:string;
  phaseName: string = "NA";
  periodicity: string="NA";
  count: string = "NA";
  endPhaseName:string = "NA";
  checkMonProgName: string;
  fromEvent: string ="NA";
  fromEvent_ui:string = "NA";
  frequency: string="2";
  frequency_ui:string = "Never";
  endEvent: string = "NA";
  endEvent_ui:string = "NA";
 
 //for log Pattern monitor
  gdfName:string;
  runOptions:string ="2";
  runOptions_ui:string = "Run Once";
  fileNameSelection:string= "-f";
  fileName :string='';
  enableSearchPattern:boolean;
  searchPattern:string;
  metric:string = "Application Metrics";
  customMetricName:string;
  journalType:string;
  specificJournalType:string;
  gdfDetails:GdfTableData[]=[];
  groupId:number=-1;
  excludeTier: string = '';

  //for log data monitor
  enableTab:boolean ;
  enableSpace:boolean;
  enableDoubleQuotes:boolean;
  enableSingleQuotes:boolean;
  enableComma:boolean;
  enableBackSlash:boolean;
  enableSemiColon:boolean;
  enableDash:boolean;
  enableEqual:boolean;
  enablefieldSepOthers:boolean;
  fieldSepOthersVal:string; 
  headerLines:string = "0";
  logLinePattern:string= ''; // for bug 77321- support of -j option in Log Data Monitor.
  instCount:number; // added -N option for no.of instances in log pattern and log data monitor.
  dumpServer:boolean; //This option dump sever logs inside the test run. Added for log pattern and log data monitor.

  actualServerName:string=""; // actual server ip for the selected server 
  agent:string; // field for agent type column in the form data

  //for custom gdf monitor
  pMode:number = 0;
  grpName: string;
  metaData:string ="";
  // metaData:string ="Tier>Server>Instance";
  snmpHost: string= '127.0.0.1';
  ver: string = '2c';
  com: string = 'public'
  user: string = '';
  authPro: string = '';
  authParams: string = '';
  encryPr: string = '';
  privParams: string = '';
  sl: string = '';
  interval:number;
  excludeServer: string = '';
  //for multiple file support bug id 80307
  readMulFile:boolean;

  tierForAnyServer:string = "";    //for any tier server
  tierGroupForAnyServer:string = "";   //for any tier group server

 //  added for Batch Jobs
  batchSearchPattern: string = "NA";
  logFile: string = "NA";
  cmdName:string = "NA";
  successCriteria:string="1";  
 //These fields are added for future purpose.
  future1:string = "NA";
  future2:string = "NA";
  future3:string = "NA";
  future4:string = "NA";
  future5:string = "NA";
  future6:string = "NA";

  progName:string = ""; 
  configPath:string = "";
  progType:string = ""; 
  monName:string="";
  dvm:string = "";
  sysDef:number = -1; //for bug 58611 - system defined command monitors = 1; user defined command monitors = 0; others = -1
  runProc:string = "false"; // run-as-process field for bug - 94588
  rCon:RemoteConnectionData = new RemoteConnectionData;
  //adv:AdvSettings = new AdvSettings;
 }


 