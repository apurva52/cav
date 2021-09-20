export class CmdData {
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
}