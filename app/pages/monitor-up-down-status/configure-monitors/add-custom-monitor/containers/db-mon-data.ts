import { GdfInfo } from "./gdf-info-data";

export class DbMonData {
  monN: string = ""; // Custom Mon Name which is same as group name.
  oN: string = ""; // old monitor name
  cat: string = "system"; //category name by default it will be Command Monitor
  opt: string = ""; // options
  gdfInfo: GdfInfo = new GdfInfo;
  output: string = ""; // output of the query
  host:string = "";
  port:string = "";
  dbName = ""; // database name
  dC = "";  //driver class
  uN = ""; //DB user name
  pwd = ""; //DB password
  tsf = ""; // Trust Store File-path
  tsp = ""; // Trust Store Password
  ksf = ""; // Key Store File-path
  ksp = ""; // Key Store password
  query = ""; // Query
  dbServer:boolean = false;   //check if user wants to run query in other database server
  connectData:string = "";
  tier: boolean = true; // tier
  server: boolean = true; // server
  qryTier:string = "";
  qryServer:string = "";
  sslType:string = "";
  custSSL:string = "";
  conSid:string = "";
  conService:string = "";
  encripDbData:string = "";
  classPath:string; //classpath for giving external jar paths
  authMode:string = ""; //added for MSSQL db Authentication Mode (Windows/SQL)
  ip:string = ''
  tierId:string = ""
  serverId:string = "";
  cusCat: string = "";
}