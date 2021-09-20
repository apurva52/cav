import { AdvSettings } from "./adv-settings-data";

export class DbData {
    host: string = ""; // host
    port: number = 22; // port
    user: string = ""; // username
    pwd: string = ""; //pwd
    rT:string = ""; // remote tier
    rS:string = ""; // remote server display name
    rSDpName:string = "";
    executeRemote:boolean =false;
    cT:string = "";
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
    adv:AdvSettings = new AdvSettings;
    classPath:string = ""
    javaHome:string = ""
}