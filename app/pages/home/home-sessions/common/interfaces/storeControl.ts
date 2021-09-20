
export class StoreControl
{
	storeid: number;
	from: string;
	duration: number;
	registerPct: number;
	totalRegisters: number;

	constructor()
	{
	  this.storeid = 0;
	  this.from = "";
	  this.duration = 0;	
	  this.registerPct = 20;
	  this.totalRegisters = 20;
	}
}
