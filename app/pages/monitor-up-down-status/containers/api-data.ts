import { ClientCTX } from "src/app/core/session/session.model";

export class APIData {
   
    tName: string = null; // technology name
    saveMonDTO: any = {}; // save object
    gMonID: string; // monitor id
    objectId: string; // object id
    type: string = "";
    monName: string = null;
    tier: string = null;
    server: string = null;
    monStatus: number = 0;
    autoMonDTOs:any
    gdfName:string
    cctx:ClientCTX;
    tr:number;
}