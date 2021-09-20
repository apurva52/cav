import { Injectable } from '@angular/core';

@Injectable()
export class NsCommonService {
	private _currRowData: any;
	private _sessionIndex: string;
	private _avgTime: string;
	private _sesssionDuration: string;
	private _childIdx: string;
	private _scriptName: string;
	private _objectType: string;
	private _failureType: string;
	private _isSuccess:string;
	private _isFromSummary:boolean;
	private _barDataForSessionComp:any;
	private _isFromSessionCompDetail:boolean = false;
	/**
	 * Ns Page Report
	 */
	private _pgSummaryToInstanceData: string;
	//private _pgSummaryToInstanceFlag: boolean = false;
	private _pgSummaryToSessionSummaryData: string;
	private _pgSummaryToSessionSummaryFlag: boolean = false;
	private _pgSummaryToFailureData: string;
	private _pgFailureToInstanceFlag: boolean = false;
	private _pgFailureToInstanceData: string;
	private _pgSummaryToCompDetailData: string;
	private _pgDetailToURLDetailFlag: boolean = false;
	private _pgDetailToURLDetailData: any;
	private _pageInstance: any;
        private _isFromSummaryByStatus:boolean=false;
	/**
	 * NS URL Report
	 */
	private _urlInstanceData: any;
	private _failureStatus;
	private _urlsessionsummarydata;
	private _urlidx: any;
	private _urlreportid: boolean;
	private _urlfaildata: any;
	private _urltimeparam;
	private _urldetaildata;
	private _urlSummaryData;
	/**
	 * NS Transaction
	 */
	private _summaryToInstanceFlag: boolean = false;
	private _failureToInstanceFlag: boolean = false;
	private _sessionSummaryFlag: boolean = false;
	private _summaryByStatusFlag: boolean = false;
	private _transactionName: any;
	private _transactionIndex: any;
	private _pageindex: any;
	private _statuscode: any;
	private _scriptname: any;
	private _averagetime: any;
	private _sessionInst: any;
	private _childIndex: any;

	private _userId:string;
	
	// For instance report through success flag
	public urlInstancethroughsuccess: boolean = false;
	public sessionInstancethroughsuccess: boolean = false;
	public transactionInstancethroughsuccess: boolean = false;

	/**
	 * NS Transaction
	 */
	
    public get summaryToInstanceFlag(): boolean {
        return this._summaryToInstanceFlag;
  }
   public set summaryToInstanceFlag(value: boolean) {    
        this._summaryToInstanceFlag = value;
   }
    
   public get failureToInstanceFlag(): boolean {
    return this._failureToInstanceFlag;
}
public set failureToInstanceFlag(value: boolean) {    
    this._failureToInstanceFlag = value;
}
public get sessionSummaryFlag(): boolean {
    return this._sessionSummaryFlag;
}
public set sessionSummaryFlag(value: boolean) {    
    this._sessionSummaryFlag = value;
}
public get summaryByStatusFlag(): boolean {
    return this._summaryByStatusFlag;
}
public set summaryByStatusFlag(value: boolean) {    
    this._summaryByStatusFlag = value;
}
 public get transactionName(): any {
  return this._transactionName;
 }

 public set transactionName(value: any) {
  this._transactionName = value;
    }
    public get transactionIndex(): any {
  return this._transactionIndex;
 }

 public set transactionIndex(value: any) {
  this._transactionIndex = value;
    }
    public get scriptname(): any {
  return this._scriptname;
 }

 public set scriptname(value: any) {
  this._scriptname = value;
    }
    public get sessionInst(): any {
  return this._sessionInst;
 }

 public set sessionInst(value: any) {
  this._sessionInst = value;
    }

    public get childIndex(): any {
  return this._childIndex;
 }

 public set childIndex(value: any) {
  this._childIndex = value;
    }

    public get averagetime(): any {
  return this._averagetime;
 }

 public set averagetime(value: any) {
  this._averagetime = value;
    }
    public get statuscode(): any {
  return this._statuscode;
 }

 public set statuscode(value: any) {
  this._statuscode = value;
    }
    public get pageindex(): any {
  return this._pageindex;
 }

 public set pageindex(value: any) {
  this._pageindex = value;
    }
	/**
	 * NS Page Report
	 */
	public get pgSummaryToInstanceData(): string {
		return this._pgSummaryToInstanceData;
	}

	public set pgSummaryToInstanceData(value: string) {
		this._pgSummaryToInstanceData = value;
	}


	/*public get pgSummaryToInstanceFlag(): boolean {
		return this._pgSummaryToInstanceFlag;
	}

	public set pgSummaryToInstanceFlag(value: boolean) {
		this._pgSummaryToInstanceFlag = value;
	}*/

	public get pgSummaryToSessionSummaryData(): string {
		return this._pgSummaryToSessionSummaryData;
	}

	public set pgSummaryToSessionSummaryData(value: string) {
		this._pgSummaryToSessionSummaryData = value;
	}

	public get pgSummaryToSessionSummaryFlag(): boolean {
		return this._pgSummaryToSessionSummaryFlag;
	}

	public set pgSummaryToSessionSummaryFlag(value: boolean) {
		this._pgSummaryToSessionSummaryFlag = value;
	}

	public get pgSummaryToFailureData(): string {
		return this._pgSummaryToFailureData;
	}

	public set pgSummaryToFailureData(value: string) {
		this._pgSummaryToFailureData = value;
	}

	public get pgFailureToInstanceFlag(): boolean {
		return this._pgFailureToInstanceFlag;
	}

	public set pgFailureToInstanceFlag(value: boolean) {
		this._pgFailureToInstanceFlag = value;
	}

	public get pgFailureToInstanceData(): string {
		return this._pgFailureToInstanceData;
	}

	public set pgFailureToInstanceData(value: string) {
		this._pgFailureToInstanceData = value;
	}

	public get pgSummaryToCompDetailData(): string {
		return this._pgSummaryToCompDetailData;
	}

	public set pgSummaryToCompDetailData(value: string) {
		this._pgSummaryToCompDetailData = value;
	}

	public get pageInstance(): any {
		return this._pageInstance;
	}

	public set pageInstance(value: any) {
		this._pageInstance = value;
	}


	public get pgDetailToURLDetailFlag(): boolean {
		return this._pgDetailToURLDetailFlag;
	}

	public set pgDetailToURLDetailFlag(value: boolean) {
		this._pgDetailToURLDetailFlag = value;
	}

	public get pgDetailToURLDetailData(): any {
		return this._pgDetailToURLDetailData;
	}

	public set pgDetailToURLDetailData(value: any) {
		this._pgDetailToURLDetailData = value;
	}

	public get isFromSummaryByStatus(): boolean {
		return this._isFromSummaryByStatus;
	}

	public set isFromSummaryByStatus(value: boolean) {
		this._isFromSummaryByStatus = value;
	}

	/**
	 * NS URL Report
	 */
	public get urlidx(): any {
		return this._urlidx;
	}

	public set urlidx(value: any) {
		this._urlidx = value;
	}

	public get FailureStatus(): any {
		return this._failureStatus;
	}

	public set FailureStatus(value: any) {
		this._failureStatus = value;
	}

	public get urlInstanceData(): any {
		return this._urlInstanceData;
	}

	public set urlInstanceData(value: any) {
		this._urlInstanceData = value;
	}

	public get urlfaildata(): any {
		return this._urlfaildata;
	}

	public set urlfaildata(value: any) {
		this._urlfaildata = value;
	}

	public set urlsessionsummarydata(value: any) {
		this._urlsessionsummarydata = value;
	}
	public get urlsessionsummarydata(): any {
		return this._urlsessionsummarydata;
	}

	public set urlreportid(value: any) {
		this._urlreportid = value;
	}
	public get urlreportid(): any {
		return this._urlreportid;
	}

	public set urltimeparam(value: any) {
		this._urltimeparam = value;
	}
	public get urltimeparam(): any {
		return this._urltimeparam;
	}

	public set urldetaildata(value: any) {
		this._urldetaildata = value;
	}
	public get urldetaildata(): any {
		return this._urldetaildata;
	}
	public set urlSummaryData(value: any) {
		this._urlSummaryData = value;
	}
	public get urlSummaryData(): any {
		return this._urlSummaryData;
	}
	/**
	 * NS Session
	 */

	public get isFromSummary(): boolean {
		return this._isFromSummary;
	}

	public set isFromSummary(value: boolean) {
		this._isFromSummary = value;
	}

	public get isSuccess(): string {
		return this._isSuccess;
	}

	public set isSuccess(value: string) {
		this._isSuccess = value;
	}
	
	public get failureType(): string {
		return this._failureType;
	}

	public set failureType(value: string) {
		this._failureType = value;
	}
	public get objectType(): string {
		return this._objectType;
	}

	public set objectType(value: string) {
		this._objectType = value;
	}

	public get scriptName(): string {
		return this._scriptName;
	}

	public set scriptName(value: string) {
		this._scriptName = value;
	}

	public get sesssionDuration(): string {
		return this._sesssionDuration;
	}

	public set sesssionDuration(value: string) {
		this._sesssionDuration = value;
	}

	public get childIdx(): string {
		return this._childIdx;
	}

	public set childIdx(value: string) {
		this._childIdx = value;
	}

	public get avgTime(): string {
		return this._avgTime;
	}

	public set avgTime(value: string) {
		this._avgTime = value;
	}

	public get sessionIndex(): string {
		return this._sessionIndex;
	}

	public set sessionIndex(value: string) {
		this._sessionIndex = value;
	}

	public get currRowData(): any {
		return this._currRowData;
	}

	public set currRowData(value: any) {
		this._currRowData = value;
	}

	public get barDataForSessionComp(): any {
		return this._barDataForSessionComp;
	}

	public set barDataForSessionComp(value: any) {
		this._barDataForSessionComp = value;
	}

	public get isFromSessionCompDetail(): boolean {
		return this._isFromSessionCompDetail;
	}

	public set isFromSessionCompDetail(value: boolean) {
		this._isFromSessionCompDetail = value;
	}


	public get userId(): string {
		return this._userId;
	}

	public set userId(value: string) {
		this._userId = value;
	}
	
}
