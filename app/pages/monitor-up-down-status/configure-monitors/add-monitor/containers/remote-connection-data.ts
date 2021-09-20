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