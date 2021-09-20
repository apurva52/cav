/**
 * This class is used as a common service for all Components.
 * Any variable that can be accesed from all Components we can be define here.
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { DdrDataModelService } from "./ddr-data-model.service";
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import 'moment-timezone';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
// import { CavConfigService } from '../../../..services/cav-config.service';
// import { CavTopPanelNavigationService } from '../../..services/cav-top-panel-navigation.service';
import { Message } from 'primeng/api';
import { DDRRequestService } from './ddr-request.service';
//export let LZString = require("./../../../../../node_modules/lz-string/libs/lz-string.js");
//export let jsPlumb = require("./../../../../../node_modules/jsplumb/dist/js/jsplumb.min.js");

@Injectable()
export class CommonServices {
    id: QueryParams;
    queryData: DdrDataModelService;
    data: any;
    private _mtFlag: boolean = false;
    private _mtData: any;
    public indexArr: Array<number> = [];
    fpFlag: string;
    compareThreadDump: any;
    private _hsFlag: boolean = false;
    private _hsData: any;
    dataForServiceMethod;
    private _cmdFileName: string="";
    private _mctFlag: boolean = false;
    private _mctData: any={};
    private _httpFlag: boolean = false;
    private _httpData: any;
    private _fpByBTData: any;
    private _exptoFpData: any;
    private _hstofpData: any;
    private _hstoexData: any;
    private _signatureTomt = false;
    private _signatureToDB = false;
    private _windowHeight: any;
    private _signatureTofpFlag: boolean = false;
    private _signatureTofpData: any;
    loaderForDdr: boolean = false;
    _dbflowpathdata: any;
    private _flowpathToExFlag = false;
    private _flowpathToExData: any;

    private _isToLoadSideBar: boolean = false;
    _ddrSideBarOnApply: any;
    rowspaerpage: number = 50;
    sortedField: any = 'fpDuration';
    sortedOrder: any = '-1';
    NVUrl: string;
    checkNVSessionId: string = "0";
   // private _customToFlowpathFlag = false;
    private _customToFlowpathData: any;
    private _patternflag = false;

    private _currentReport: string = "";
    private _previousReport: string = "";
    isCheckedFlowpath: boolean;
    flowpathInstance: string = "";
    private _fpFilters: any = {};
    private _fpGroupByFilters: any = {};
    private _dbGroupByFilters: any = {};
    private _dbFilters: any = {};
    private _methodTimingFilters: any = {};
    private _exceptionFilters: any = {};
    private _hotspotFilters: any = {};
    private _ipSummaryFilters: any = {};
    private _expDataFromED: any;
    private _fromDBtoExpFlag = false;
    private _fromDBtoExpData: any;
    public sideBarUI$: Subject<Object> = new Subject<Object>();
    public sideBarUIObservable$: Observable<Object> = this.sideBarUI$.asObservable();
    public closeUISideBar$: Subject<Object> = new Subject<Object>();
    public closeUISideBarObservable$: Observable<Object> = this.closeUISideBar$.asObservable();
    showTransactionFlowmap: boolean = false;
    showMethodCallingTree: boolean = false;
    showHotspot: boolean = false;
    showMethodTiming: boolean = false;
    showDbreport: boolean = false;
    showHttp: boolean = false
    openFlowMapTab: boolean = false;
    openFlowpath: boolean = true;
    openMethodCallingTreeTab: boolean = false;
    openMethodTimingTab: boolean = false;
    openHttpTab: boolean = false
    openHotspotTab: boolean = false
    openDbTab: boolean = false;
    isIntegratedFlowpath: boolean = true;
    showExceptionReport: boolean = false;
    openExceptionTab: boolean = false;
    showIPSummary: boolean = false;
    openIPSummary: boolean = false;
    fptoAggMT: boolean = false;
    _dbtoflowpath = false;
    host: string;
    port: string;
    protocol: string;
    testRun: string;
    private _dcNameList: string;
    private _selectedDC;
    private _isAllCase;
    private _tierNameList;
    private _nvFiltersFlag: boolean = false;
    private _dbDataFromFPInED: any;
    isAllowed: boolean = true;
    prevFlowPathData;
    public flowpathHomeData$: Subject<Object> = new Subject<Object>();
    public flowpathHomeDataObservable$: Observable<Object> = this.flowpathHomeData$.asObservable();
    selectedData: any;
    showAllTabs: boolean = false;
    openCurrentFlowpathTab: boolean = false;
    CurrentflowpathData = [];
    private _strGraphKey: any;
    private _hsDataFromED: any;
    paramsForBtTrend: any;
    selectedRowInfoOfBtTrend: any;
    hotspotToIP = false;
    hotspotToIPData: any;
    private _fpAnalyzeData: any={};
    private _flowpathCmdArgs: any;
    private _cmdArgsFlag = false;
     //private _cmdArgsFlagc = false;
    ipSummaryData: any;
    private _fromhstoExpFlag = false;
    private _btTrendRowData :any ;
    /**
    * use for Opening Flowpath from NS SessionReport
    */
   // private _fpIdFromNSSession: string;
    private _isFromBTTrend = false;
    private _sqlTimingData: any;
    errMsg: Message[];
    jsonData;
    isFromEd : boolean = false;
    isFromCopyLink : boolean = false;
    ajaxTimeOut  = 60000;
    BtRequestType = 2; //Keyword For Bt-Trend Request Type
    splitView: boolean =true;
    enableQueryCaching = 0; //KeyWord for enable QueryCahing 
    private _seqDiagToDBFlag : boolean=false;
    private _seqDiagToDBData: any;
    private _seqDiagToExceptionFlag : boolean=false;
    private _seqDiagToExceptionData: any;
    private _ipstatToExceptionFlag: boolean=false;
    fpLimit;
    fpOffset;
      isFromFpInstance : boolean = false;
	private _isFilterFromSideBar = false ;
	private _queryCountToDB : any = {} ;
	private _productName : string;

    //flowpath to ED case
    edStrStartDate : Date;
    edStrEndDate : Date;
	
// NS Report Filters for side bar in ns reports	
	nsTransactionSummary: any= {};
    nsTransactionInstance : any= {};
    nsSessionSummary: any= {};
    nsSessionInstance : any= {};
    nsURLSummary: any= {};
    nsURLInstance : any= {};
    nsPageSummary: any= {};
    nsPageInstance : any= {};
    nsUserSession : any = {};
    customTimePlaceHolder=[];
    nsTRansactionSessionSummary: any={};  
    nsTransactionFailure: any={};
    IPByFPData;
  // IPByFPFlag = false;
    isCQM: boolean = false;
    nsTransactionDetails: any;
    isFromTransactionSummary: boolean = false;
    isFromTransactionSession: boolean = false;
    isFromTransactionInstance: any = false;
    nsSessionTiming: any = {};
    isFromTransactionFailure: boolean = false;
    isFromTranscationDetails: any = false;
    nsPageDetails: any = {};
    isFromPageSummary: boolean = false;
    nsPageFailure: any = {};
    nsPageSessionSummary: any = {};
    isFromPageFailure: any;
    isFromPageInstance: any = false;
    isFromBreadCrumb: boolean = false;
    isFromPageSessionSummary: boolean = false;
    nsSessionFailure: any = {};
    isFromSessionSummary: boolean = false;
    isFromSessionFailure: boolean = false;
    isFromSessionInstance: boolean = false;
    isFromUrlSummary: boolean = false;
    nsURLFailure: any = {};
    isFromUrlFailure: boolean = false;
    nsURLSession: any = {};
    isFromUrlSession: boolean = false;
    nsTimeFlag: boolean = false;
    isFilterFromNSSideBar: boolean = false;
    isFirtNF: boolean = false;
    cancelationMessage = "Query is taking time to load, either wait for the query to load or cancel the process.";
    private nsAutoFillSub = new Subject<any>();
    public nsAutoFillObservable$: Observable<Object> = this.nsAutoFillSub.asObservable();
    constructor(private _ddrData: DdrDataModelService, private route: ActivatedRoute, private router: Router,
        private http:HttpClient, private _router: Router,
        private ddrRequest:DDRRequestService) {
        console.log('_ddrData inside constructor', this._ddrData);
        if (_ddrData.testRun != undefined) {
            this.queryData = this._ddrData;
             this.removeFromStorage();
            this.setInStorage = this.queryData;
        }
         if (this._router.url.indexOf('?') != -1 ) {
            this.isFromEd = true;
           
          }

         if (this._router.url.indexOf('/home/ddrCopyLink/flowpath') != -1 ) {
            this.isFromCopyLink = true;
          }

          if(!this.isFromEd){
            if(isNaN(this._ddrData.ajaxTimeOut)){
                  this.ajaxTimeOut = 60000
              }
              else{
                this.ajaxTimeOut =  this._ddrData.ajaxTimeOut;
              }

            if(this._ddrData.enableQueryCaching == 1){
            this.enableQueryCaching = Number(this._ddrData.enableQueryCaching);
            sessionStorage.setItem('enableQueryCaching',this._ddrData.enableQueryCaching.toString() );
            }else
            this.enableQueryCaching = Number(sessionStorage.getItem('enableQueryCaching'));           
            
            this.BtRequestType = Number(this._ddrData.BtRequestType);
            
          }
        this.id = this.getData();
    }


    public get productName(): any {
        return this._productName;
    }

    public set productName(value: any) {
        this._productName = value;
    }

    public get seqDiagToExceptionData(): any {
        return this._seqDiagToExceptionData;
    }

    public set seqDiagToExceptionData(value: any) {
        this._seqDiagToExceptionData = value;
    }

    public get seqDiagToExceptionFlag(): boolean {
        return this._seqDiagToExceptionFlag;
    }

    public set seqDiagToExceptionFlag(value: boolean) {
        this._seqDiagToExceptionFlag = value;
    }
        public get ipstatToExceptionFlag(): any {
        return this._ipstatToExceptionFlag;
    }

    public set ipstatToExceptionFlag(value: any) {
        this._ipstatToExceptionFlag = value;
    }

    public get seqDiagToDBData(): any {
        return this._seqDiagToDBData;
    }

    public set seqDiagToDBData(value: any) {
        this._seqDiagToDBData = value;
    }

    public get seqDiagToDBFlag(): boolean {
        return this._seqDiagToDBFlag;
    }

    public set seqDiagToDBFlag(value: boolean) {
        this._seqDiagToDBFlag = value;
    }

  /*  public get fpIdFromNSSession(): string {
        return this._fpIdFromNSSession;
    }

    public set fpIdFromNSSession(value: string) {
        this._fpIdFromNSSession = value;
    }*/

    public get isFromBTTrend(): boolean {
        return this._isFromBTTrend;
    }

    public set isFromBTTrend(value: boolean) {
        this._isFromBTTrend = value;
    }

    public get cmdArgsFlag(): boolean {
        return this._cmdArgsFlag;
    }

    public set cmdArgsFlag(value: boolean) {
        this._cmdArgsFlag = value;
    }


    public get cmdFileName(): string {
        return this._cmdFileName;
    }

    public set cmdFileName(value: string) {
        this._cmdFileName = value;
    }



    public get fromhstoExpFlag(): boolean {
        return this._fromhstoExpFlag;
    }

    public set fromhstoExpFlag(value: boolean) {
        this._fromhstoExpFlag = value;
    }

    public get flowpathCmdArgs(): any {
        return this._flowpathCmdArgs;
    }

    public set flowpathCmdArgs(value: any) {
        this._flowpathCmdArgs = value;
    }

    public get fpAnalyzeData(): any {
        return this._fpAnalyzeData;
    }

    public set fpAnalyzeData(value: any) {
        this._fpAnalyzeData = value;
    }

    public get currentReport(): string {
        return this._currentReport;
    }

    public set currentReport(value: string) {
        this._currentReport = value;
    }
    public get previousReport(): string {
        return this._previousReport;
    }

    public set previousReport(value: string) {
        this._previousReport = value;
    }
    
    public get fpFilters(): any {
        return this._fpFilters;
    }

    public set fpFilters(value: any) {
        this._fpFilters = value;
    }
    public get fpGroupByFilters(): any {
        return this._fpGroupByFilters;
    }

    public set fpGroupByFilters(value: any) {
        this._fpGroupByFilters = value;
    }
    public get dbGroupByFilters(): any {
        return this._dbGroupByFilters;
    }

    public set dbGroupByFilters(value: any) {
        this._dbGroupByFilters = value;
    }
    public get hotspotFilters(): any {
        return this._hotspotFilters;
    }

    public set hotspotFilters(value: any) {
        this._hotspotFilters = value;
    }


    public get ipSummaryFilters(): any {
        return this._ipSummaryFilters;
    }

    public set ipSummaryFilters(value: any) {
        this._ipSummaryFilters = value;
    }
    

    public get dbFilters(): any {
        return this._dbFilters;
    }

    public set dbFilters(value: any) {
        this._dbFilters = value;
    }
    public get openfptoAggMT(): any {
        return this.fptoAggMT;
    }

    public set openfptoAggMT(value: any) {
        this.fptoAggMT = value;
    }

    public get methodTimingFilters(): any {
        return this._methodTimingFilters;
    }

    public set methodTimingFilters(value: any) {
        this._methodTimingFilters = value;
    }
    public get exceptionFilters(): any {
        return this._exceptionFilters;
    }

    public set exceptionFilters(value: any) {
        this._exceptionFilters = value;
    }
    public get patternflag(): boolean {
        return this._patternflag;
    }

    public set patternflag(value: boolean) {
        this._patternflag = value;
    }

  /*  public get customToFlowpathFlag(): boolean {
        return this._customToFlowpathFlag;
    }

    public set customToFlowpathFlag(value: boolean) {
        this._customToFlowpathFlag = value;
    } */

    public get customToFlowpathData(): any {
        return this._customToFlowpathData;
    }

    public set customToFlowpathData(value: any) {
        this._customToFlowpathData = value;
    }

    public get flowpathToExData(): any {
        return this._flowpathToExData;
    }

    public set flowpathToExData(value: any) {
        this._flowpathToExData = value;
    }
    public get flowpathToExFlag(): boolean {
        return this._flowpathToExFlag;
    }

    public set flowpathToExFlag(value: boolean) {
        this._flowpathToExFlag = value;
    }

    public get signatureTofpData(): any {
        return this._signatureTofpData;
    }

    public set signatureTofpData(value: any) {
        this._signatureTofpData = value;
    }
    public get signatureTofpFlag(): boolean {
        return this._signatureTofpFlag;
    }

    public set signatureTofpFlag(value: boolean) {
        this._signatureTofpFlag = value;
    }

    public get signatureToDB(): boolean {
        return this._signatureToDB;
    }

    public set signatureToDB(value: boolean) {
        this._signatureToDB = value;
    }

    public get signatureTomt(): boolean {
        return this._signatureTomt;
    }

    public set signatureTomt(value: boolean) {
        this._signatureTomt = value;
    }

    public get mctFlag(): boolean {
        return this._mctFlag;
    }

    public set mctFlag(value: boolean) {
        this._mctFlag = value;
    }


    public get mctData(): any {
        return this._mctData;
    }

    public set mctData(value: any) {
        this._mctData = value;
    }

    public get httpFlag(): boolean {
        return this._httpFlag;
    }

    public set httpFlag(value: boolean) {
        this._httpFlag = value;
    }

    public get httpData(): any {
        return this._httpData;
    }

    public set httpData(value: any) {
        this._httpData = value;
    }
    get getFPData(): any {
        return this.data;
    }

    set setFPData(value: any) {
        this.data = value;
    }

    get getFPFlag(): any {
        return this.fpFlag;
    }

    set setFPFlag(value: any) {
        this.fpFlag = value;
    }

    public get mtData(): any {
        return this._mtData;
    }

    public set mtData(value: any) {
        this._mtData = value;
    }
    public get mtFlag(): boolean {
        return this._mtFlag;
    }
    public set mtFlag(value: boolean) {
        this._mtFlag = value;
    }

    public get hsFlag(): boolean {
        return this._hsFlag;
    }

    public set hsFlag(value: boolean) {
        this._hsFlag = value;
    }

    public get hsData(): any {
        return this._hsData;
    }

    public set hsData(value: any) {
        this._hsData = value;
    }

    public get fpByBTData(): any {
        return this._fpByBTData;
    }

    public set fpByBTData(value: any) {
        this._fpByBTData = value;
    }

    public get compareData(): any {
        return this.compareThreadDump;
    }

    public set compareData(value: any) {
        this.compareThreadDump = value;
    }

    public get exptoFpData(): any {
        return this._exptoFpData;
    }

    public set exptoFpData(value: any) {
        this._exptoFpData = value;
    }

    public get screenHeight() {
        return window.innerHeight;
    }

    public set screenHeight(value: any) {
        this._windowHeight = value;
    }

    public get dbflowpathdata() {
        return this._dbflowpathdata;
    }

    public set dbflowpathdata(value: any) {
        this._dbflowpathdata = value;
    }

    public get hstofpData(): any {
        return this._hstofpData;
    }

    public set hstofpData(value: any) {
        this._hstofpData = value;
    }

    public get hstoexData(): any {
        return this._hstoexData;
    }

    public set hstoexData(value: any) {
        this._hstoexData = value;
    }


    public get isToLoadSideBar(): any {
        return this._isToLoadSideBar;
    }

    public set isToLoadSideBar(value: any) {
        this._isToLoadSideBar = value;
    }
    public get ddrSideBarOnApply(): any {
        return this._ddrSideBarOnApply;
    }

    public set ddrSideBarOnApply(value: any) {
        this._ddrSideBarOnApply = value;
    }

    public get expDataFromED(): any {
        return this._expDataFromED;
    }

    public set expDataFromED(value: any) {
        this._expDataFromED = value;
    }

    public get fromDBtoExpData(): any {
        return this._fromDBtoExpData;
    }

    public set fromDBtoExpData(value: any) {
        this._fromDBtoExpData = value;
    }

    public get fromDBtoExpFlag(): any {
        return this._fromDBtoExpFlag;
    }

    public set fromDBtoExpFlag(value: any) {
        this._fromDBtoExpFlag = value;
    }
    public get dbtoflowpath() {
        return this._dbtoflowpath;
    }

    public set dbtoflowpath(value: any) {
        this._dbtoflowpath = value;
    }

    public get selectedDC(): any {
        return this._selectedDC;
    }
    public set selectedDC(value: any) {
        this._selectedDC = value;
    }

    public get dcNameList(): string {
        return this._dcNameList;
    }

    public set dcNameList(value: string) {
        this._dcNameList = value;
    }

    public get isAllCase(): string {
        return this._isAllCase;
    }

    public set isAllCase(value: string) {
        this._isAllCase = value;
    }

    public get tierNameList(): string {
        return this._tierNameList;
    }

    public set tierNameList(value: string) {
        this._tierNameList = value;
    }

    public get nvFiltersFlag(): boolean {
        return this._nvFiltersFlag;
    }

    public set nvFiltersFlag(value: boolean) {
        this._nvFiltersFlag = value;
    }

    public get dbDataFromFPInED(): any {
        return this._dbDataFromFPInED;
    }

    public set dbDataFromFPInED(value: any) {
        this._dbDataFromFPInED = value;
    }

    public get strGraphKey(): any {
        return this._strGraphKey;
    }

    public set strGraphKey(value: any) {
        this._strGraphKey = value;
    }

    public get hsDataFromED(): any {
        return this._hsDataFromED;
    }

    public set hsDataFromED(value: any) {
        this._hsDataFromED = value;
    }

    public get sqlTimingData(): any {
        return this._sqlTimingData;
    }

    public set sqlTimingData(value: any) {
        this._sqlTimingData = value;
    }

    public get queryCountToDB(): any {

        return this._queryCountToDB;
    }

    public set queryCountToDB(value: any) {
        this._queryCountToDB = value;
    }
    public get isFilterFromSideBar(): any {
        return this._isFilterFromSideBar;
    }

    public set isFilterFromSideBar(value: any) {
        this._isFilterFromSideBar = value;
    }

    public get btTrendRowData(): any {
        return this._btTrendRowData;
    }

    public set btTrendRowData(value: any) {
        this._btTrendRowData = value;
    }
    getCorelationmodeValue(resMode) {

        if (resMode == "1")
            return "Exact";
        else if (resMode == "2")
            return "Starts With";
        else if (resMode == "3")
            return "Ends With";
        else if (resMode == "4")
            return "Contains";
    }

    getBTCategoryID(category) {
        if (category === 'Very Slow') {
            category = '12';
        }
        if (category === 'Slow') {
            category = '11';
        }
        if (category === 'Normal') {
            category = '10';
        }
        if (category === 'Errors') {
            category = '13';
        }
        return category;
    }

    getBTCategoryName(category) {
        if (category == '12') {
            category = 'Very Slow';
        }
        if (category == '11') {
            category = 'Slow';
        }
        if (category == '10') {
            category = 'Normal';
        }
        if (category == '13') {
            category = 'Errors';
        }
        if (category == '0') {
            category = 'Others';
        }
        return category;
    }
    isValidParamInObj(obj: any, key: string) {
        if (obj[key] != undefined && obj[key] != "undefined" && obj[key] != "" && obj[key] != 'AllTransactions' && obj[key] != 'All' && obj[key] != 'Overall' && obj[key] != null && obj[key] != "null" && obj[key] != "NA" && obj[key] != "-")
            return true;
        else
            return false
    }
    isValidParameter(param: string) {
        if (param != undefined && param != "undefined" && param != "" && param != null && param != "null" && param != "NA" && param != "-")
            return true;
        else
            return false
    }
    makeObjectFromUrlParam(urlParam: string) {
        let urlParamObj = {};
        let keyValueParam = urlParam.split('&');
        keyValueParam.forEach((val, index) => {
            let keyValue = val.split('=');
            urlParamObj[keyValue[0]] = keyValue[1];
        });
        console.log("method - makeObjectFromUrlParam & url param obj = ", urlParamObj);
        return urlParamObj;

    }

    /*
      This function will return parameter string formed on the basis of object passed to it
    */
   makeParamStringFromObj(paramsObj: any,index?) {
    let paramStr: string = '';
    let keys = Object.keys(paramsObj);
    let i;
    if(index)
    i=0;
    else
    i=1;
    for ( i; i < keys.length; i++) {
        let paramKey = keys[i];
        let paramValue = paramsObj[keys[i]];

        // console.log("paramKey--",paramKey)
        // console.log("paramValue--",paramValue)
        if (paramValue != undefined)
            paramValue = paramValue.toString();

        // if (i == 0)
        //     paramStr = paramKey + "=" + paramValue;
        // else
            paramStr += "&" + paramKey + "=" + paramValue;
    }
    return paramStr;
}

    getData(): QueryParams {

        let ddrQueryParam = new QueryParams();
        if (!this._ddrData.testRun) {
            return this.getFromStorage();
        }
        ddrQueryParam.testRun = this._ddrData.testRun;
        if(ddrQueryParam.testRun)
            this.testRun = ddrQueryParam.testRun;
        ddrQueryParam.tierName = this._ddrData.tierName;
        ddrQueryParam.serverName = this._ddrData.serverName;
        ddrQueryParam.appName = this._ddrData.appName;
        ddrQueryParam.startTime = this._ddrData.startTime ;
        ddrQueryParam.endTime = this._ddrData.endTime ;
        console.log('startTime and Endtime in Service', this._ddrData.startTime, ' and ', this._ddrData.endTime)
        ddrQueryParam.ipWithProd = this._ddrData.ipWithProd;
        ddrQueryParam.urlName = this._ddrData.urlName;
        ddrQueryParam.dbReportCategory = this._ddrData.dbReportCategory;
        ddrQueryParam.strGroup = this._ddrData.strGroup;
        ddrQueryParam.product = this._ddrData.product;
        ddrQueryParam.ndSessionId = this._ddrData.ndSessionId;
        ddrQueryParam.nvPageId = this._ddrData.nvPageId;
        ddrQueryParam.nvSessionId = this._ddrData.nvSessionId;
        ddrQueryParam.urlParam = this._ddrData.urlParam;
        ddrQueryParam.isFromNV = this._ddrData.isFromNV;
        ddrQueryParam.strOrderBy = this._ddrData.strOrderBy;
        if(!ddrQueryParam.product)
        {
         ddrQueryParam.product="netdiagnostics";  
        }  
        
        ddrQueryParam.product = ddrQueryParam.product.toLowerCase();

        let timeZoneId=sessionStorage.getItem("timeZoneId");
	if(timeZoneId && timeZoneId !== "undefined" && timeZoneId !== "null" &&  timeZoneId.trim() !== ""){
         if(ddrQueryParam.startTime)
            ddrQueryParam.startTimeInDateFormat = moment(ddrQueryParam.startTime).tz(timeZoneId).format("MM/DD/YY HH:mm:ss");
         if(ddrQueryParam.endTime)
            ddrQueryParam.endTimeInDateFormat = moment(ddrQueryParam.endTime).tz(timeZoneId).format("MM/DD/YY HH:mm:ss");
        }
        else {
            this.setTimeZoneID().then(() => {
               if(ddrQueryParam.startTime)
                ddrQueryParam.startTimeInDateFormat = moment(ddrQueryParam.startTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY HH:mm:ss");
               if(ddrQueryParam.endTime)
                ddrQueryParam.endTimeInDateFormat = moment(ddrQueryParam.endTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY HH:mm:ss");
            });
        }
        ddrQueryParam.isZoomPanel = this._ddrData.isZoomPanel + "";
        ddrQueryParam.restDrillDownUrl = this._ddrData.restDrillDownUrl;
        ddrQueryParam.userName = this._ddrData.userName;
        ddrQueryParam.graphId = this._ddrData.graphId;
        // alert(this._ddrData.vecArrForGraph.toString());
        if(typeof(this._ddrData.vecArrForGraph)!=="undefined")
        {
        ddrQueryParam.vecArrForGraph = this._ddrData.vecArrForGraph.toString();
        }
        ddrQueryParam.btCategory = this._ddrData.btCategory;
        ddrQueryParam.strOrderBy = this._ddrData.strOrderBy;
        ddrQueryParam.mtFlag = this._ddrData.mtFlag;
        ddrQueryParam.strGraphKey = this._ddrData.strGraphKey;
        ddrQueryParam.urlIndex = this._ddrData.urlIndex;
        ddrQueryParam.customData = '';
        ddrQueryParam.correlationId = this._ddrData.correlationId;
        ddrQueryParam.mode = this._ddrData.mode;
        ddrQueryParam.flowpathID = '';
        ddrQueryParam.customOptions = '';
        ddrQueryParam.queryTime = this._ddrData.queryTime;
        ddrQueryParam.queryTimeMode = this._ddrData.queryTimeMode;
        ddrQueryParam.tierId = this._ddrData.tierId;
        ddrQueryParam.serverId = this._ddrData.serverId;
        ddrQueryParam.appId = this._ddrData.appId;
        ddrQueryParam.cmdArgsFlag = this._ddrData.cmdArgsFlag;
       if(this._ddrData.backendId) {
        ddrQueryParam.backendId = this._ddrData.backendId;
        } 
        if(this._ddrData.backendName)
           ddrQueryParam.backendName = this._ddrData.backendName;
        if(this._ddrData.backendRespTime)
           ddrQueryParam.backendRespTime = this._ddrData.backendRespTime;
        if(sessionStorage.getItem("isMultiDCMode")=="true")
           this.host = undefined;
        return ddrQueryParam;
    }


    public set setInStorage(DdrDataModelService) {
        sessionStorage.setItem("testRun", DdrDataModelService.testRun);
        sessionStorage.setItem("tierName", DdrDataModelService.tierName);
        sessionStorage.setItem("serverName", DdrDataModelService.serverName);
        sessionStorage.setItem("appName", DdrDataModelService.appName);
        sessionStorage.setItem("ipWithProd", DdrDataModelService.ipWithProd);
        sessionStorage.setItem("startTime", DdrDataModelService.startTime);
        sessionStorage.setItem("endTime", DdrDataModelService.endTime);
        sessionStorage.setItem("urlName", DdrDataModelService.urlName);
        sessionStorage.setItem("dbReportCategory", DdrDataModelService.dbReportCategory);
        sessionStorage.setItem("strGroup", DdrDataModelService.strGroup);
        sessionStorage.setItem("product", DdrDataModelService.product);
        sessionStorage.setItem("fpAnalyzerFlag", DdrDataModelService.cmdArgsFlag);
         let timeZoneId=sessionStorage.getItem("timeZoneId");
	if(timeZoneId && timeZoneId !== "undefined" && timeZoneId !== "null" && timeZoneId.trim() !== "" ){
        if (DdrDataModelService.startTime) {
            let startTimeInDateFormat = moment(DdrDataModelService.startTime).tz(timeZoneId).format("MM/DD/YY HH:mm:ss");
            sessionStorage.setItem("startTimeInDateFormat", startTimeInDateFormat);
        }
        if (DdrDataModelService.endTime) {
            let endTimeInDateFormat = moment(DdrDataModelService.endTime).tz(timeZoneId).format("MM/DD/YY HH:mm:ss");
            sessionStorage.setItem("endTimeInDateFormat", endTimeInDateFormat);
        }
    }
         else
    {
        this.setTimeZoneID().then(() => {
            if (DdrDataModelService.startTime) {
                let startTimeInDateFormat = moment(DdrDataModelService.startTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY HH:mm:ss");
                sessionStorage.setItem("startTimeInDateFormat", startTimeInDateFormat);
            }
            if (DdrDataModelService.endTime) {
                let endTimeInDateFormat = moment(DdrDataModelService.endTime).tz(sessionStorage.getItem('timeZoneId')).format("MM/DD/YY HH:mm:ss");
                sessionStorage.setItem("endTimeInDateFormat", endTimeInDateFormat);
            }
        });
    }
    
        sessionStorage.setItem("isZoomPanel", DdrDataModelService.isZoomPanel + "");
        sessionStorage.setItem("restDrillDownUrl", DdrDataModelService.restDrillDownUrl);
        sessionStorage.setItem("userName", DdrDataModelService.userName);
        sessionStorage.setItem("graphId", DdrDataModelService.graphId);
        console.log("vector Arr for Graph", DdrDataModelService.vecArrForGraph);
        sessionStorage.setItem("vecArrForGraph", DdrDataModelService.vecArrForGraph);
        sessionStorage.setItem("btCategory", DdrDataModelService.btCategory);
        sessionStorage.setItem("strOrderBy", DdrDataModelService.strOrderBy);
        sessionStorage.setItem("mtFlag", DdrDataModelService.mtFlag);
        sessionStorage.setItem("strGraphKey", DdrDataModelService.strGraphKey);
        sessionStorage.setItem("urlIndex", DdrDataModelService.urlIndex);
        sessionStorage.setItem('customData', DdrDataModelService.customData);
        sessionStorage.setItem('correlationId', DdrDataModelService.correlationId);
        sessionStorage.setItem('flowpathID', DdrDataModelService.flowpathID);
        sessionStorage.setItem('customOptions', DdrDataModelService.customOptions);
        sessionStorage.setItem('queryTimeMode', DdrDataModelService.queryTimeMode);
        sessionStorage.setItem('queryTime', DdrDataModelService.queryTime);
        sessionStorage.setItem('tierId', DdrDataModelService.tierId);
        sessionStorage.setItem('serverId', DdrDataModelService.serverId);
        sessionStorage.setItem('appId', DdrDataModelService.appId);
        if(DdrDataModelService.backendId) {
        sessionStorage.setItem('backendId', DdrDataModelService.backendId);
        }
        if(DdrDataModelService.backendName){
        sessionStorage.setItem('backendRespTime', DdrDataModelService.backendRespTime);
        sessionStorage.setItem('backendName',DdrDataModelService.backendName);
        }
        if(DdrDataModelService.isFromNV){
            sessionStorage.setItem('ndSessionId',DdrDataModelService.ndSessionId);
            sessionStorage.setItem('nvSessionId',DdrDataModelService.nvSessionId);
            sessionStorage.setItem('nvPageId',DdrDataModelService.nvPageId);
            sessionStorage.setItem('urlParam',DdrDataModelService.urlParam);
            sessionStorage.setItem('isFromNV',DdrDataModelService.isFromNV);
        }
    }
    public set setParameterIntoStorage(DdrDataModelService) {
        sessionStorage.setItem("ddrQuery_Param", JSON.stringify(DdrDataModelService));
    }

    removeFromStorage() {
        sessionStorage.removeItem("testRun");
        sessionStorage.removeItem("tierName");
        sessionStorage.removeItem("serverName");
        sessionStorage.removeItem("appName");
        sessionStorage.removeItem("ipWithProd");
        sessionStorage.removeItem("startTime");
        sessionStorage.removeItem("endTime");
        sessionStorage.removeItem("urlName");
        sessionStorage.removeItem("dbReportCategory");
        sessionStorage.removeItem("strGroup");
        sessionStorage.removeItem("product");
        sessionStorage.removeItem("startTimeInDateFormat");
        sessionStorage.removeItem("endTimeInDateFormat");
        sessionStorage.removeItem("isZoomPanel");
        sessionStorage.removeItem("restDrillDownUrl");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("graphId");
        sessionStorage.removeItem("vecArrForGraph");
        sessionStorage.removeItem("btCategory");
        sessionStorage.removeItem("strOrderBy");
        sessionStorage.removeItem("mtFlag");
        sessionStorage.removeItem('strGraphKey');
        sessionStorage.removeItem('urlIndex');
        sessionStorage.removeItem("ddrQuery_Param");
        sessionStorage.removeItem('customData');
        sessionStorage.removeItem('correlationId');
        sessionStorage.removeItem('flowpathID');
        sessionStorage.removeItem('customOptions');
        sessionStorage.removeItem('queryTimeMode');
        sessionStorage.removeItem('queryTime');
        sessionStorage.removeItem('tierId');
        sessionStorage.removeItem('serverId');
        sessionStorage.removeItem('appId');
        sessionStorage.removeItem('backendId');
        sessionStorage.removeItem('backendRespTime');
        sessionStorage.removeItem('backendName');
        sessionStorage.removeItem('fpAnalyzerFlag');
        sessionStorage.removeItem('ndSessionId');
        sessionStorage.removeItem('nvPageId');
        sessionStorage.removeItem('nvSessionId');
        sessionStorage.removeItem('urlParam');
        sessionStorage.removeItem('isFromNV');

    }
    getFromStorage(): QueryParams {

        if (sessionStorage.getItem("ddrQuery_Param") == null || sessionStorage.getItem("ddrQuery_Param") == undefined) {
            let ddrQueryParam = new QueryParams();
            if (sessionStorage.getItem("testRun") == null || sessionStorage.getItem("testRun") == undefined) {
                let threadDumpSession = JSON.parse(localStorage.getItem('threadDumpTab'));
                if (threadDumpSession !== null) {
                    ddrQueryParam.testRun = threadDumpSession['testRun'];
                    if (ddrQueryParam.testRun)
                        this.testRun = ddrQueryParam.testRun;
                    ddrQueryParam.product = threadDumpSession['product'];
                    ddrQueryParam.userName = threadDumpSession['userName'];
                    ddrQueryParam.ipWithProd = threadDumpSession['ipWithProd'];
                } 
                console.log("first case common service");
                this._ddrData.testRun = sessionStorage.getItem("multiDCTestRun");
                this._ddrData.host = sessionStorage.getItem("multiDCHost");
                this._ddrData.port = sessionStorage.getItem("multiDCPort");
                this._ddrData.protocol = sessionStorage.getItem("multiDCProtocol");
                this._ddrData.dcName = sessionStorage.getItem("ddrDcName") ;
                this._ddrData.product = sessionStorage.getItem("product");
                 if(!this._ddrData.product)
                  {
                    this._ddrData.product="netdiagnostics";
          }
          this._ddrData.product = this._ddrData.product.toLowerCase();
            }else {
                 console.log("else cse-----");
                this._ddrData.testRun = sessionStorage.getItem("multiDCTestRun");
                this._ddrData.host = sessionStorage.getItem("multiDCHost");
                this._ddrData.port = sessionStorage.getItem("multiDCPort");
                this._ddrData.protocol = sessionStorage.getItem("multiDCProtocol");
                this._ddrData.dcName = sessionStorage.getItem("ddrDcName") ;
                this._ddrData.product = sessionStorage.getItem("product");
                   if(!this._ddrData.product || this._ddrData.product == "undefined")
                  {
                    this._ddrData.product="netdiagnostics";
                  }

                  this._ddrData.product = this._ddrData.product.toLowerCase();

                ddrQueryParam.testRun = sessionStorage.getItem("testRun");
                ddrQueryParam.tierName = sessionStorage.getItem("tierName");
                ddrQueryParam.serverName = sessionStorage.getItem("serverName");
                ddrQueryParam.appName = sessionStorage.getItem("appName");
                ddrQueryParam.ipWithProd = sessionStorage.getItem("ipWithProd");
                ddrQueryParam.startTime = sessionStorage.getItem("startTime");
                ddrQueryParam.endTime = sessionStorage.getItem("endTime");
                ddrQueryParam.urlName = sessionStorage.getItem("urlName");
                ddrQueryParam.dbReportCategory = sessionStorage.getItem("dbReportCategory");
                ddrQueryParam.strGroup = sessionStorage.getItem("strGroup");
                ddrQueryParam.product = sessionStorage.getItem("product");
                 if(!ddrQueryParam.product || ddrQueryParam.product == "undefined")
                  {
                  ddrQueryParam.product="netdiagnostics";
                  }
                  ddrQueryParam.product =  ddrQueryParam.product.toLowerCase();

                ddrQueryParam.startTimeInDateFormat = sessionStorage.getItem("startTimeInDateFormat");
                ddrQueryParam.endTimeInDateFormat = sessionStorage.getItem("endTimeInDateFormat");
                ddrQueryParam.isZoomPanel = sessionStorage.getItem("isZoomPanel");
                ddrQueryParam.restDrillDownUrl = sessionStorage.getItem("restDrillDownUrl");
                ddrQueryParam.userName = sessionStorage.getItem("userName");
                ddrQueryParam.graphId = sessionStorage.getItem("graphId");
                ddrQueryParam.vecArrForGraph = sessionStorage.getItem("vecArrForGraph");
                ddrQueryParam.btCategory = sessionStorage.getItem("btCategory");
                ddrQueryParam.strOrderBy = sessionStorage.getItem("strOrderBy");
                ddrQueryParam.mtFlag = sessionStorage.getItem("mtFlag");
                ddrQueryParam.strGraphKey = sessionStorage.getItem('strGraphKey');
                ddrQueryParam.urlIndex = sessionStorage.getItem('urlIndex');
                ddrQueryParam.customData = sessionStorage.getItem('customData');
                ddrQueryParam.correlationId = sessionStorage.getItem('correlationId');
                ddrQueryParam.flowpathID = sessionStorage.getItem('flowpathID');
                ddrQueryParam.customOptions = sessionStorage.getItem('customOptions');
                ddrQueryParam.queryTime = sessionStorage.getItem('queryTime');
                ddrQueryParam.queryTimeMode = sessionStorage.getItem('queryTimeMode');
                ddrQueryParam.tierId = sessionStorage.getItem('tierId');
                ddrQueryParam.serverId = sessionStorage.getItem('serverId');
                ddrQueryParam.appId = sessionStorage.getItem('appId');
                if(ddrQueryParam.backendId) {
                ddrQueryParam.backendId = sessionStorage.getItem('backendId');
                ddrQueryParam.backendRespTime = sessionStorage.getItem('backendRespTime');
                ddrQueryParam.backendName = sessionStorage.getItem('backendName')
                ddrQueryParam.cmdArgsFlag = sessionStorage.getItem('fpAnalyzerFlag')
                 console.log("common sessget", ddrQueryParam.backendId,ddrQueryParam.backendRespTime)
                }
                if(ddrQueryParam.isFromNV){
                    ddrQueryParam.ndSessionId = sessionStorage.getItem('ndSessionId');
                    ddrQueryParam.nvPageId = sessionStorage.getItem('nvPageId');
                    ddrQueryParam.nvSessionId = sessionStorage.getItem('nvSessionId');
                    ddrQueryParam.urlParam = sessionStorage.getItem('urlParam');
                    ddrQueryParam.isFromNV = sessionStorage.getItem('isFromNV');
                }

            }
            return ddrQueryParam;
        }
        else
            return JSON.parse(sessionStorage.getItem("ddrQuery_Param"));
        }

    removeAllComponentFromFlowpath() {
        this.showDbreport = false;
        this.showHotspot = false;
        this.showHttp = false;
        this.showMethodCallingTree = false;
        this.showMethodTiming = false;
        this.showTransactionFlowmap = false;
        this.showExceptionReport = false;
        this.openDbTab = false;
        this.openExceptionTab = false;
        this.openFlowMapTab = false;
        // this.openFlowpath = false;
        this.openHotspotTab = false;
        this.openHttpTab = false;
        this.openMethodCallingTreeTab = false;
        this.openMethodTimingTab = false;
    }

   validateFilterString(val: string) {

        if (val.replace(/ /g, "").startsWith(',')) {
            val = val.substring(1);
        }
        if (val.replace(/ /g, "").endsWith(',')) {
            val = val.substring(0, val.length - 1)
        }

        return val;

    }
    
    getHostUrl(): string {
        var hostDcName = this._ddrData.getHostUrl();
    //     if (this._navService.getDCNameForScreen("flowpath") === undefined)
    //       hostDcName = this._cavConfigService.getINSPrefix();
    //     else
    //       hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");
    
    //     if (hostDcName.length > 0) {
    //       sessionStorage.removeItem("hostDcName");
    //       sessionStorage.setItem("hostDcName", hostDcName);
    //     }
    //     else
    //       hostDcName = sessionStorage.getItem("hostDcName");
   	
	// if(hostDcName.endsWith(":"))
	//      hostDcName.substring(0,hostDcName.length-1); 

        console.log('hostDcName =', hostDcName);
        return hostDcName;
      }
    showError(msg: any) {
        if(!msg)
          msg = "No response from server";
        if (msg.includes('0 Unknown'))
            msg = "Connection refused by server. Please check Server health.";
        if (msg.includes('200'))
            msg = "No records found";
        this.errMsg = [];
	if(msg.includes('Data uploading'))
            this.errMsg.push({ severity: 'info', summary: 'Info Message', detail: msg });
	else if(msg.includes('DL Successfully Applied!'))  
            this.errMsg.push({ severity: 'success', summary: 'Success Message', detail: msg });
        else
            this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
      }

   setTimeZoneID(){
        return new Promise((resolve, reject) => {
            try {
                let url = "";
		if(this._ddrData && !this._ddrData.product)
		    this._ddrData.product = sessionStorage.getItem("product");

                if(this._ddrData.product && this._ddrData.product.lastIndexOf("/") != -1)
                     url = this.getHostUrl() + '/' + this._ddrData.product + '/v1/cavisson/netdiagnostics/ddr/getTimeZoneID';
                else if(this._ddrData.product)
                     url = this.getHostUrl() + '/' + this._ddrData.product + '/v1/cavisson/netdiagnostics/ddr/getTimeZoneID';
                this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
                    sessionStorage.setItem('timeZoneId',data);
                //   resolve();
                });
              } catch (e) {
                console.log('exception in making rest=====', e);
              }
            });
        }

getNDAjaxData(url, urlParam){

   if(this.BtRequestType == 2){
    return this.ddrRequest.getDataInStringUsingPost(url,urlParam)
   } 
   else{
    return this.ddrRequest.getDataInStringUsingGet(url)
   }
}
 //This function is used to set backendtype according to the type
 BackendTypeName(backendType) {
    var backendTypeName = "OTHER";

    if (backendType == 1)
      return "HTTP";
    else if (backendType == 2)
      return "JDBC";
    else if (backendType == 3)
      return "COHERENCE";
    else if (backendType == 4)
      return "RMI";
    else if (backendType == 5)
      return "MemCache";
    else if (backendType == 6)
      return "CLOUDANT";
    else if (backendType == 7)
      return "HADOOP";
    else if (backendType == 9)
      return "CASSANDRA";
    else if (backendType == 10)
      return "DB";
    else if (backendType == 14)
      return "JMSP";
    else if (backendType == 15 || backendType == 25)
      return "DATABASE";
    else if (backendType == 16)
      return "DATABASE";
    else if(backendType == 24)
      return "LDAP";
    else if(backendType == 26)
      return "SOCKET";
    return backendTypeName;
  }
   // This Function is used to set value in Status
   HotspotStatus(errorCount) {

    if (errorCount == false)
      return 'Success';

    else
      return 'Error';

  }

  getBackendSubType(subType,backendSubTypeNameMap)
  {
    console.log("sbType",subType);
    if(!subType || subType == 0)
    return "-";
    return backendSubTypeNameMap[subType].replace(/&#038;/g, "&").replace(/&#044;/g, ',').replace(/&#010;/g, '\n').replace(/&#039;/g, "\'").replace(/&#46;/g, ".");
  }
  formatterFixed(value) {
    if (!isNaN(value)) {
      value = (Number(value)).toFixed(3).toLocaleString();
      if (value == 0)
        value = "0";
      return value;
    }
    else
      return value;
  }
showSuccess(msg: any) {
        this.errMsg = [];
        this.errMsg.push({ severity: 'success', summary: '', detail: msg });
      }
formatter(data: any) {
        if (Number(data) && Number(data) > 0) {
          return Number(data).toLocaleString();
        } else {
          return data;
        }
      }
      checkForNsKeyObj(parentChildInfo, currentReport): any {
          console.log("current report in common service===>",currentReport);
        let keys=Object.keys(parentChildInfo)  
        console.log("keys are===>",keys);
        if (!keys.includes(currentReport)) {
            //will add if doesnt exist
            parentChildInfo[currentReport]=undefined;         //for breadcrumb filters bieng passed in case of CQM filters.
                console.log("commonservice first entry in key  ", parentChildInfo);
            }
            else
            {
                console.log("keys already exist==>");
            }
        // else{
        //     for(let i=0;i<keys.length;i++)
        //     {
        //         currentReport=parentChildInfo[keys[i]];
        //         console.log("commonservice second entry for value to current report CQM.  ",parentChildInfo[keys[i]]);
        //         //this will add the param to CQM Filters.
        //     }
        // }
        }
        getNSAutoFill(currentReport)
        {
             this.nsAutoFillSub.next(currentReport);
        }

    nsAutoFillSideBar(currentReport?,nextReport?) {
        console.log("autoFIll side bar ----------------- ");


        if(currentReport && nextReport)//condition for when user apply cqm and then opens another reoport.
        {   
            console.log(" current Report object for auto fill *********",this._ddrData.nsCqmAutoFill[currentReport],
            "next Report object for auto fill *********" ,this._ddrData.nsCqmAutoFill[nextReport]);
            
            if(this._ddrData.nsCqmAutoFill[currentReport]==undefined)
            {
              console.log("current report undefined ****************,", this._ddrData.nsCqmAutoFill[currentReport]);
              this._ddrData.nsCqmAutoFill[currentReport]={}; 
            }
            this._ddrData.nsCqmAutoFill[nextReport]=JSON.parse(JSON.stringify(this._ddrData.nsCqmAutoFill[currentReport]));
            console.log("next Report object for auto fill afterrrrr*********",this._ddrData.nsCqmAutoFill[nextReport]);
           
            if(nextReport.indexOf('Instance')!=-1 )   // in case when going from summary to instance
            {  let obj;
                obj=this.filterGroupOrder(this._ddrData.nsCqmAutoFill[nextReport]);
                this._ddrData.nsCqmAutoFill[nextReport]=obj;
           }
            this.getNSAutoFill(nextReport); 

            //condition for when user apply cqm and then opens another reoport.

        }
        else if(currentReport) //condition as per user has ben travelling through breadcrumb .
       { console.log("currentReport ******* else cond ",currentReport);
        this.getNSAutoFill(currentReport);
       }

    }
    filterGroupOrder(Obj) {
        console.log("filter group order *** ",Obj);
        let keyValue=JSON.parse(JSON.stringify(Obj));
       // console.log("*************** temp *********** ",temp)
        
        if (keyValue['Group'] && keyValue['Order'] ) {         // will work if group is included 
            //console.log('key value inside the instance group removal *******', keyValue);
            let group = keyValue['Group'];
            let order = keyValue['Order'];
            order = order.filter(val => !group.includes(val)); //if val is included in group ! will give us false and hence filter will not include the element in order.
            // hence giving us order elemets - group elements.
            keyValue['Order'] = order;
       //     console.log("order now************", keyValue["Order"]);
            delete keyValue['Group'];
            return keyValue;
        }
        if ((keyValue['group'] || keyValue['strGroupBy']) && keyValue['order'] ) {         // will work if group is included 
            //console.log('key value inside the instance group removal *******', keyValue);
            let group ;
            if( keyValue['group'])
            group=keyValue['group'].split(",");
            else
            group =keyValue['strGroupBy'].split(",");
            let order = keyValue['order'].split(",");
            order = order.filter(val => !group.includes(val)); //if val is included in group ! will give us false and hence filter will not include the element in order.
            // hence giving us order elemets - group elements.
            keyValue['order'] = order.toString();
          //  console.log("order now************2222222222222", keyValue["order"]);
            delete keyValue['group'];
            delete keyValue['strGroupBy'];
            return keyValue;
        }
    }

}


export class QueryParams {
    testRun: string;
    tierName: string;
    serverName: string;
    appName: string;
    startTime: string;
    endTime: string;
    startTimeInDateFormat: string;
    endTimeInDateFormat: string;
    ipWithProd: string;
    dbReportCategory: string;
    strGroup: string;
    urlName: string;
    product: string;
    isZoomPanel: string;
    restDrillDownUrl: string;
    userName: string;
    graphId: string;
    vecArrForGraph: string;
    btCategory: string;
    strOrderBy: string;
    mtFlag: string;
    strGraphKey: string;
    urlIndex: string;
    customData: string;
    correlationId: string;
    flowpathID: string;
    customOptions: string;
    queryTimeMode: string;
    queryTime: string;
    tierId: string;
    serverId: string;
    appId: string;
    backendId: string;
    backendRespTime: string;
    backendName: string;
    mode:any;
    ndSessionId: string;
    nvPageId : string;
    nvSessionId: string;
    urlParam : string;
    isFromNV : string;
    cmdArgsFlag:any;
}
