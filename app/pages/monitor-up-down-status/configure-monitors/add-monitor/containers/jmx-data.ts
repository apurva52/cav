import { AdvSettings } from "./adv-settings-data";

export class JmxData {
    host: string = ""; // host
    port: number = 22; // port
    user: string = ""; // username
    pwd: string = ""; //pwd
    pHost: string = ""; //proxy host
    pPort: number = 3128; // proxy port
    pUser: string = ""; // proxy user
    proxyPwd: string = ""; // proxy pwd
    instance:string;
    tsf:string = ""; // Trust Store File-path
    tsp:string = ""; // Trust Store Password
    tst:string = ""; // Trust Store Password
    ksf:string = ""; // Key Store File-path
    ksp:string = ""; // Key Store password
    connURL: string;     //JMX Connection URL
    sslEnable: boolean = false;
    otherConn: string;
    pid: number; //process ID
    pidFile: string; //process ID File
    occCount: number = 1; //Occurence count
    jmxConn: string = "setting";
    jmxConnPID: string = "";
    adv:AdvSettings = new AdvSettings;
    agent:string="CMON";
}