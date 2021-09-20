export class AWSConfigDTO
{
	id:number;
	aNKey:string = "";
    tType:number = 0;
	tag:string = "";
	toHostWithTag:string = "";
	toLamdaWithTag:string = "";
	
	//Access Key
	aKey:string = "";       //Access Key
	sKey:string = "";       //Secret Access Key
	
	//Delegation
	dRole:string = "";
	dAccID:string = "";
	
	
	region:string = "";
	
	isCWAlarm:boolean = false;
	isCustM:boolean = false;
	
	//proxy
	pHost:string = "";
	pPort:number;
	pUser:string = "";
	pPwd:string = "";

	exNameSpace:string;		//Exclude Namespace

}
