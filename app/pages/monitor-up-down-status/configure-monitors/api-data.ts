import { CmdMonData } from "./add-custom-monitor/containers/configure-cmd-mon-data";

export class APIData{
    //tName:string = "tomcat";
    saveMonDTO:any = {};
    gMonID:string;
    objectId:string;
    techName:string = "tomcat";
    TR = -1;
    uName:string = "cavisson";
    role:string = "admin";
    tName:string = "All"; //tech Name
    tier:string = "All"; //tier Name
    server:string = "All"; //Server Name
    cmdMonData:CmdMonData = new CmdMonData()
    
}