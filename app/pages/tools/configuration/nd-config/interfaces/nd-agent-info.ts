export interface NDAgentInfo {
    ai:number;
	tier:string;
	server:string;
	instance:string;
	iD:string;
	ver:string;
	brs:string;
	bst?:string;
	nst :string;
	st:string;
	at:string;
	pid:string;
	ch?:string;
	si:string;
	cpath:string;
	os?:string;
	tierGroup?:string
}

export interface CmonInfo{
	cp:string;
	tier: string;
	sn:string;
	mt:string;
	cv:string;
	aia: string;
	cst:string;
	id:number;
	si:any;
	cpath:string;
	ccut: string;
	ch: string;
	cmonAgent?: string;
	// serverIp: string;
	// testRunNo:string;
	// testRunning:boolean;
	// topoName: string;
	// appName:string;
	// cmonHome:string;
	// cmonJavaHome:string;
}

export interface CmonEnvInfo {
    displayName: string;
    vaue: number;
    Type: string;
    downloadmsg : string;
}
