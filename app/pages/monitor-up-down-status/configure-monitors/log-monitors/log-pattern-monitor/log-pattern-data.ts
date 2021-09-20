import { GdfTableData } from "../../add-custom-monitor/containers/gdf-table-data";

export class LogPatternData { 
    instance:string;
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
    readMulFile:boolean;
    instCount:number; // added -N option for no.of instances in log pattern and log data monitor.
    dumpServer:boolean; //This option dump sever logs inside the test run. Added for log pattern and log data monitor.

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
  trailingChar:string = "0";

  // for get log file
  fileLocation:string;
  truncateFile:boolean = false;
  logFileSize:number=10;
  checkLogRemote:boolean = false;
  remoteServer:string;
  remoteHierarchy:string;
  fileLocationval:string;

  //added for snmp monitor
  pMode:number = 0;
  grpName: string;
  metaData:string ="Tier>Server>Instance";
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
 }