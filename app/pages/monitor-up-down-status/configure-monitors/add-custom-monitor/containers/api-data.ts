
import { ClientCTX } from "src/app/core/session/session.model";

export class APIData{
    saveMonDTO:any = {};
    gMonID:string;
    TR = -1;
    uName:string = "";
    role:string = "admin";
    tName:string = ""; //tech Name
    topo = "default";
    mode = 0; // 0 edit, 1 Runtime, 2 View, 3 TrView
    objectId = "-1";
    monStatus = "0"; // 0 total, 1 running, 2 fail 3 disabled
    cctx:ClientCTX;
}