import { AdvSettings } from './adv-settings-data';
import { RemoteConnectionData } from './remote-connection-data';

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
  rCon:RemoteConnectionData = new RemoteConnectionData;
  adv:AdvSettings = new AdvSettings;
 }


 