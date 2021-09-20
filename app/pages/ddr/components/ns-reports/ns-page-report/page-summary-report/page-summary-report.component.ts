import { Component, OnInit ,Input} from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { SelectItem } from '../../../../interfaces/selectitem';
import { Router } from '@angular/router';
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { DdrDataModelService } from "../../../../../../main/services/ddr-data-model.service";
import { Subscription } from 'rxjs/Rx';
import { DDRRequestService } from '../../../../services/ddr-request.service';
import {Message} from'primeng/primeng';
@Component({
  selector: 'app-page-summary-report',
  templateUrl: './page-summary-report.component.html',
  styleUrls: ['./page-summary-report.component.css']
})
export class PageSummaryReportComponent implements OnInit {
  @Input("summaryByStatus") pageSummaryByStatus:boolean;
  pageSummaryData : Array<PageSummaryInterface>;
  urlParam:any;
  limit:number = 50;
  offset:number = 0;
  cols:any[];
  visibleCols: any[];
  columnOptions: SelectItem[];
  url:string;
  totalCount:any;
  prevColumn:any;
  screenHeight:any;
  filterCriteria:string="";
  tableHeader:string="";
  status:string= "";
  loading = false;
  strTitle:any;
  showDownloadOption:boolean=true;
  dynamicWidthColumn : number ;  //  To calculate dynamic width of column
  subscribePage:Subscription;
  toolTipStatus: string='';
  toolTipUrl: string='';
  filterStatus: string='';
  filterUrl: string='';
  renameArr: any;
  colOrder: any;
  msgs: Message[] = [];
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  value: number;
  loader: boolean;
  constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService , private _router: Router,private nsCommonData:NsCommonService,
    private breadcrumbService: DdrBreadcrumbService,private _ddrData: DdrDataModelService,private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.commonService.isToLoadSideBar=true;
    console.log("this.pageSummaryByStatus = " , this.pageSummaryByStatus , " , pgSummaryToSessionSummaryFlag = " , this.nsCommonData.pgSummaryToSessionSummaryFlag);
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.urlParam = this.commonService.getData();
    this.randomNumber();
    console.log(" **** url Param **** " , this.urlParam);
    this.nsCommonData.isFromSummaryByStatus = this.pageSummaryByStatus;
    if(this.pageSummaryByStatus == true)
    {
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY_BY_STATUS);
      this.tableHeader = "Page Summary By Status";
    }
    else
    {
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY);
      this.tableHeader = "Page Summary";
    }
    this.commonService.currentReport="Page Summary";
  
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsTransactionSessionSummary==>",this.commonService.nsTransactionSummary); 
  
  
    this.subscribePage=this.commonService.sideBarUIObservable$.subscribe((temp)=>{
      if(this.commonService.currentReport=="Page Summary")
    { 
      this.loading = true;
      this.limit=50;
      this.offset=0;
      this.getPageSummaryData(); 
      this.getPageSummaryDataCount();
      this.makeColumns();  
    }
    }) 
    this.getPageSummaryData();
    this.getPageSummaryDataCount();
    this.makeColumns();
    this.setTestRunHeader();
    this._ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessage(mssg)});
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.urlParam.testRun = this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.urlParam.testRun);
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  makeColumns()
  {
    this.cols = [{ field: 'pageName', header: 'Page Name', sortable: true, action: true, align: 'left', width: '70' },
    
    { field: 'tried', header: 'Tried', sortable: 'custom', action: true, align: 'right', width: '50'},
    { field: 'success', header: 'Success', sortable: 'custom', action: true, align: 'right', width: '50'},
    { field: 'fail', header: 'Fail', sortable: 'custom', action: true, align: 'right', width: '50'}];   

    this.cols = this.cols.concat(
    { field: 'min', header: 'Min', sortable: 'custom',action: true, align: 'right', width: '70'},
    { field: 'max', header: 'Max', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'avg', header: 'Average', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'median', header: 'Median', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'percent80', header: '80%tile', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'percent90', header: '90%tile', sortable: 'custom', action: true, align: 'right',width: '70'},
    { field: 'percent95', header: '95%tile', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'percent99', header: '99%tile', sortable: 'custom', action: true, align: 'right', width: '70'}
    );
    
    this.renameArr={
      'pageName':'Page Name','tried':'Tried','success':'Success','fail':'Fail','min':'Min',
      'max':'Max','avg':'Average','median':'Median','percent80':'80%tile','percent90':'90%tile','percent95':'95%tile','percent99':'99%tile'
    }

    this.colOrder = ['Page Name','Tried','Success','Fail','Min','Max','Median','Average','80%tile','90%tile','95%tile','99%tile'];
  
    this.visibleCols = [
      'pageName','tried','success','fail','min','max','avg','median','percent80','percent90',
      'percent95','percent99'
    ];
    
    
    
    if (this.commonService.nsPageSummary['group'] && this.commonService.nsPageSummary['group'].indexOf('status') != -1) {
      this.cols.push({ field: 'status', header: 'Status', sortable: true, action: true, width: '30' })
      this.visibleCols.push("status");

      this.renameArr['status'] = 'Status';
      this.colOrder.push('Status');
  }
  else {
      this.cols.push({ field: 'failPercent', header: '%Fail', sortable: 'custom', action: true, align:'right',width: '20' })
      this.visibleCols.push('failPercent');
      this.renameArr['failPercent'] = '%Fail';
      this.colOrder.push('%Fail');
  }
  if (this.commonService.nsPageSummary['group'] && this.commonService.nsPageSummary['group'].indexOf('generator') != -1) {
      this.cols.push({ field: 'generatorName', header: 'Generator Name', sortable: 'custom', action: true, align: 'left', width: '30' })
      this.visibleCols.push('generatorName');
      this.renameArr['generatorName'] = 'Generator Name';
      this.colOrder.push('Generator Name');
  }if (this.commonService.nsPageSummary['group'] && this.commonService.nsPageSummary['group'].indexOf('transaction') != -1) {
      this.cols.push({ field: 'transactionName', header: 'Transaction Name', sortable: 'custom', action: true, align: 'left', width: '50'});
      this.visibleCols.push("transactionName");
      this.renameArr['transactionName']='Transaction Name';
      this.colOrder.push('Transaction Name');
    }
    if (this.commonService.nsPageSummary['group'] && this.commonService.nsPageSummary['group'].indexOf('session') != -1) {
      this.cols.push({ field: 'scriptName', header: 'Script Name', sortable: 'custom', action: true, align: 'left', width: '30' })
      this.visibleCols.push('scriptName');
      this.renameArr['scriptName'] = 'Script Name';
      this.colOrder.push('Script Name');
    }
    else
    {
      this.cols.push({ field: 'scriptCount', header: 'Script Count', sortable: 'custom', action: true, align: 'right',width: '50'})
      this.visibleCols.push('scriptCount');
      this.renameArr['scriptCount']='Script Count';
      this.colOrder.push('Script Count');
   
    }
      console.log("this.cols final = " , this.cols);

   

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    console.log('column options', this.columnOptions);
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
  }

  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    if (this.visibleCols.length !== 0) {
      for (let i = 0; i < this.cols.length; i++) {
        for(let j = 0; j < this.visibleCols.length; j++) {
          if (this.cols[i].field === this.visibleCols[j]) {
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
  }

  getPageSummaryData()
  { let ajaxParam='';
    console.log(" ***** get Data from Query this.commonService.enableQueryCaching***** ",this.commonService.enableQueryCaching); 
    if(this.commonService.enableQueryCaching == 1){
      this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageSummary?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
    }
    else{
      this.url = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageSummary?testRun=' + this.urlParam.testRun;
    }
    if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsPageSummary).length!=0) {
      console.log("this.commonService.isFilterFromNSSideBar===>",this.commonService.isFilterFromNSSideBar);
      if (this.pageSummaryByStatus)
      {
        let group=[]
        group=this.commonService.nsPageSummary['group'];
        if( group[0]=='' || group[0]==undefined)
        { 
          group[0]='status';
        }
        this.commonService.nsPageSummary['group']=group;
      }
      ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsPageSummary);
      this.commonService.isCQM=true;       //for summary to store filter cqm in breadcrumb case.
     // for FIlter CQM case    so that will update value in key pair.
     this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsPageSummary;
     console.log("inside first cond==>",this.commonService.isCQM);
    } 
    else
    {
      ajaxParam = '&startTime=' + this.urlParam.startTime + '&endTime=' + this.urlParam.endTime + '&status=-2&object=1&field=4095&summaryByStatusFlag='
        + this.pageSummaryByStatus + '&summaryToSessionSummaryFlag=false';

      // if(this._ddrData.groupName=="Page Download"  && this._ddrData.vectorName!='undefined'&& this._ddrData.vectorName!=undefined )
      //   ajaxParam += '&pageName=' + this._ddrData.vectorName;
      
      if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
      ajaxParam += '&groupName=' +this._ddrData.vectorName;
     if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
      ajaxParam += '&generatorName=' +this._ddrData.generatorName;

      if (this._ddrData.nsErrorName){
        ajaxParam +='&nsErrorName=' + this._ddrData.nsErrorName ;
      }
    
      if (this.pageSummaryByStatus === true) {
        ajaxParam += '&group=status';
      }
     // this.commonService.nsPageSummary = this.commonService.makeObjectFromUrlParam(ajaxParam);

    }
    console.log("this.commonService.isCQM====>",this.commonService.isCQM);
    if(this.commonService.isCQM)
    {
      console.log("inside data of page summary==>",this._ddrData.nsCQMFilter);
      //this.commonService.nsTransactionSummary=this._ddrData.nsCQMFilter[this.commonService.currentReport];
      ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsPageSummary,true);
      this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsPageSummary;
      console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);
      console.log("ajax param are==>",ajaxParam);
    }
    else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
      this.commonService.isCQM=true;
      console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
      ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
    }
    this.commonService.nsPageSummary = this.commonService.makeObjectFromUrlParam(ajaxParam);
    this.url+=ajaxParam;
    let finalUrl = this.url + '&limit=' + this.limit + '&offset=' + this.offset + '&showCount=false' + '&queryId='+this.queryId ;
    console.log("final url *** " , finalUrl);

    setTimeout(() => {
      this.openpopup();
     }, this._ddrData.guiCancelationTimeOut);

    return this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => this.assignPageSummaryData(data));
  }
  assignPageSummaryData(res : any)
  {
    this.isCancelQuerydata = true;
   this.commonService.isFilterFromNSSideBar = false;
    console.log("response for page summary = " , res);
    this.loading = false;
    this.loader = false;
    this.pageSummaryData = res.data;
    if(this.pageSummaryData.length == 0)
      this.showDownloadOption = false;
    else
      this.showDownloadOption = true;
    this.showFilterCriteria(res.startTimeInDateFormat,res.endTimeInDateFormat);
    this.commonService.customTimePlaceHolder=[];
    this.commonService.customTimePlaceHolder.push(res.startTimeInDateFormat, res.endTimeInDateFormat);
  }
  
  getPageSummaryDataCount()
  {
    this.url += "&showCount=true"; 
    console.log(" url in data count = " , this.url);
    return this.ddrRequest.getDataUsingGet(this.url).subscribe(data => this.assignPageSummaryDataCount(data));
  }

  assignPageSummaryDataCount(res : any)
  {
    console.log("res in data count = " , res);
    this.totalCount = res.count;
    if (this.limit > this.totalCount)
        this.limit = Number(this.totalCount); 
  }

  showFilterCriteria(startTimeInDateFormat: any, endTimeInDateFormat: any) {
    this.filterCriteria='';
    this.toolTipStatus='';
    this.toolTipUrl='';
    this.filterStatus='';
    this.filterUrl=''; 
    let pageSummary = this.commonService.nsPageSummary;
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filterCriteria += "DC=" + this._ddrData.dcName;
    if (!this.commonService.isValidParamInObj(pageSummary, 'phaseName')) {
      if (startTimeInDateFormat != "NA" && startTimeInDateFormat != "" && startTimeInDateFormat != undefined && startTimeInDateFormat != "undefined")
        this.filterCriteria += ", From=" + startTimeInDateFormat;
      if (endTimeInDateFormat != "NA" && endTimeInDateFormat != "" && endTimeInDateFormat != undefined && endTimeInDateFormat != "undefined")
        this.filterCriteria += ", To=" + endTimeInDateFormat;
    } 

    if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
    if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

    if (this.commonService.isValidParamInObj(pageSummary, 'script'))
      this.filterCriteria += ", script=" + pageSummary.script;
    if (this.commonService.isValidParamInObj(pageSummary, 'url'))
  {
    let url=pageSummary['url'];
    if(url && url.length>=20)
    {
      this.toolTipUrl+=pageSummary['url'];
      url=url.substring(0,19);
      this.filterUrl += ", Url=" + url+" ....";
    }
    else
    this.filterUrl += ", Url=" + url;
  }
    if (this.commonService.isValidParamInObj(pageSummary, 'phaseName'))
      this.filterCriteria += ", Phase Name=" + pageSummary.phaseName;
    //    this.filterCriteria += ", url=" + pageSummary.url;
    if (this.commonService.isValidParamInObj(pageSummary, 'transactionName'))
      this.filterCriteria += ", transactionName=" + pageSummary.transactionName;
    if (this.commonService.isValidParamInObj(pageSummary, 'page'))
      this.filterCriteria += ", page" + pageSummary.page
    if (this.commonService.isValidParamInObj(pageSummary, 'location'))
      this.filterCriteria += ", location=" + pageSummary.location
    if (this.commonService.isValidParamInObj(pageSummary, 'access'))
      this.filterCriteria += ", access=" + pageSummary.access
    if (this.commonService.isValidParamInObj(pageSummary, 'browser'))
      this.filterCriteria += ", browser=" + pageSummary.browser
    if (this.commonService.isValidParamInObj(pageSummary, 'group'))
      this.filterCriteria += ", group=" + pageSummary.group
    if (this.commonService.isValidParamInObj(pageSummary, 'order'))
      this.filterCriteria += ", order=" + pageSummary.order
    if (this.commonService.isValidParamInObj(pageSummary, 'statusName')) {
      let status = pageSummary['statusName'];
      if (status && status.length >= 20) {
        this.toolTipStatus += pageSummary['statusName'];
        status = status.substring(0, 19);
        this.filterStatus += ", Status=" + status + " ....";
      }
      else
        this.filterStatus += ", Status=" + status;
    }
  //  this.filterCriteria += ", Status=" + pageSummary.statusName;
    if (this.filterCriteria.startsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(1);
      
    if (this.filterCriteria.endsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  openPageInstanceReport(nodeData:any,status?:any)
  {
  console.log("nodeData for instance report = " , nodeData);
  this._ddrData.nsCQMFilter["Page Instance"]=undefined;
  let statusValue = '';
  if(this.pageSummaryByStatus == true){
    statusValue = nodeData.statusCode;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY_BY_STATUS;
  }
  else{
    statusValue = status;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY;
  }
  console.log("statusValue = " , statusValue);
  this.nsCommonData.statuscode = statusValue;
  this.nsCommonData.pgSummaryToInstanceData = nodeData;
  //this.nsCommonData.pgSummaryToInstanceFlag = true;
  this._ddrData.pgSummaryToInstanceFlag = true;
  this._ddrData.pageFailure = false;
  //this._router.navigate(['/home/ddr/nsreports/PageInstance'], {queryParams:{ statusField : statusValue}});
  
  if(this.commonService.isCQM)
  {
    this.commonService.nsPageInstance=JSON.parse(JSON.stringify(this.commonService.nsPageSummary));
    if(this.commonService.nsPageInstance['group'] && this.commonService.nsPageInstance['order'])
    this.commonService.nsPageInstance=this.commonService.filterGroupOrder(this.commonService.nsPageInstance);
    else
    delete this.commonService.nsPageInstance['group'];
   // this.commonService.nsPageInstance['status']=statusValue;
    if (this._ddrData.pgSummaryToInstanceFlag == true) {
      this.commonService.nsPageInstance['pageName'] = this.nsCommonData.pgSummaryToInstanceData['pageName'];
      this.commonService.nsPageInstance['scriptName']= this.nsCommonData.pgSummaryToInstanceData['scriptName'];
      this.commonService.nsPageInstance['pageIndex']= this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
      // ajaxParam += '&pageName=' + this.pageName + '&script=' + this.scriptName + "&pageIndex=" + this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
    }
    this.commonService.isFromPageSummary=true;
    if(nodeData['status']!=undefined && nodeData['status']!="-" && nodeData['status']!="NA") //works incase of group by status
    {
      this.commonService.nsPageInstance['status']=nodeData['statusCode'];
    } 
   
  }
  this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Page Instance');
  this.commonService.isFilterFromNSSideBar=false;
  this._router.navigate(['/home/ddr/nsreports/PageInstance']);
  }

  openPageSessionSummaryReport(nodeInfo:any)
  {
    console.log("nodeInfo for session summary report = " , nodeInfo);
    this._ddrData.nsCQMFilter["Page Session Summary"]=undefined;
    this.nsCommonData.pgSummaryToSessionSummaryData = nodeInfo;
    this.nsCommonData.pgSummaryToSessionSummaryFlag = true;
    if(this.pageSummaryByStatus == true)
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY_BY_STATUS;    
    else
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY;
  
    
      if(this.commonService.isCQM)
      {
        this.commonService.nsPageSessionSummary=JSON.parse(JSON.stringify(this.commonService.nsPageSummary));
        this.commonService.nsPageSessionSummary['pageName']=this.nsCommonData.pgSummaryToSessionSummaryData['pageName'];
        this.commonService.nsPageSessionSummary['pageIndex']=this.nsCommonData.pgSummaryToSessionSummaryData['pageIndex'];
        this.commonService.isFromPageSummary=true;
  
        if(nodeInfo['status']!="-")
        {
          this.commonService.nsPageSessionSummary['status']=nodeInfo['statusCode'];
        }
      }  
      this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Page Session Summary');
    this._router.navigate(['/home/ddr/nsreports/PageSessionSummary']);
  }

  openPageFailureReport(nodeRow : any)
  { 
    
    console.log("data obj for page failure==>",this.commonService.nsPageFailure);
    console.log("node row for page failure report = " , nodeRow);
    this._ddrData.nsCQMFilter["Page Failure"]=undefined;
    this.nsCommonData.pgSummaryToFailureData = nodeRow;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY;

    if (this.commonService.isCQM) {
  
      this.commonService.nsPageFailure = JSON.parse(JSON.stringify(this.commonService.nsPageSummary));
      // if (this.commonService.nsPageFailure['page']) {
      //   this.commonService.nsPageFailure['objectId'] = this.commonService.nsPageFailure['pageidx'];
      //   delete this.commonService.nsPageFailure['pageidx'];
      // }

      console.log("0th cond==>",this.commonService.nsPageFailure);
      if (!this.commonService.nsPageFailure['pageName']) {
        
        this.commonService.nsPageFailure['objectId'] = this.nsCommonData.pgSummaryToFailureData['pageIndex'];
        this.commonService.nsPageFailure['pageName'] = this.nsCommonData.pgSummaryToFailureData['pageName'];
      console.log("1st cond==>",this.commonService.nsPageFailure);
      } else {
        console.log("2nd cond==>",this.commonService.nsPageFailure);
        this.commonService.nsPageFailure['objectId'] = this.commonService.nsPageFailure['pageIndex'];
        delete this.commonService.nsPageFailure['pageIndex'];
        //this.commonService.nsPageFailure['pageName'] = this.nsCommonData.pgSummaryToFailureData['pageName'];
      }
      if(!this.commonService.nsPageFailure['scriptName'])
     this.commonService.nsPageFailure['scriptName']=this.nsCommonData.pgSummaryToFailureData['scriptName'];
      
   // this.scriptName = this.nsCommonData.pgSummaryToFailureData['scriptName'];

      delete this.commonService.nsPageFailure['transidx'];
      if (this.commonService.nsPageFailure['script']) {
        this.commonService.nsPageFailure['scriptName'] = this.commonService.nsPageFailure['script'];
        delete this.commonService.nsPageFailure['script'];

      }
      if (this.commonService.nsPageFailure['transactionName']) {
        this.commonService.nsPageFailure['trans'] = this.commonService.nsPageFailure['transactionName'];
        delete this.commonService.nsPageFailure['transactionName'];

      }
      this.commonService.nsPageFailure['reportType'] = 'failure';
      if (this.commonService.nsPageFailure['status'] == -2 || this.commonService.nsPageFailure['status'] == -0) {
        this.commonService.nsPageFailure['status'] = -1;
      }
      delete this.commonService.nsPageFailure['location'];
      delete this.commonService.nsPageFailure['access'];
      delete this.commonService.nsPageFailure['browser'];
      delete this.commonService.nsPageFailure['fields'];
      delete this.commonService.nsPageFailure['transidx'];
      delete this.commonService.nsPageFailure['group'];
      delete this.commonService.nsPageFailure['order'];
      this.commonService.isFromPageSummary = true;
      if(nodeRow['status']!="-")
    {
      this.commonService.nsPageFailure['status']=nodeRow['statusCode'];
    } 
    }
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Page Failure');


    this._router.navigate(['/home/ddr/nsreports/PageFailure']);
  }

  openPageComponentDetailReport(row:any)
  {
    if(this.commonService.isCQM)
    {
      //handeleing the required object fields in the page comp details itself and not here.
      this.commonService.nsPageDetails=JSON.parse(JSON.stringify(this.commonService.nsPageSummary));
      this.commonService.isFromPageSummary=true;
      console.log("going our of page summary to page details");

    } 
      console.log("row = " , row);
    this.nsCommonData.currRowData = row;
    this.nsCommonData.objectType= '1';
    this.nsCommonData.isFromSessionCompDetail = false;
    if(this.pageSummaryByStatus == true)
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY_BY_STATUS;
    else
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SUMMARY;
    this._router.navigate(['/home/ddr/nsreports/PageComponentDetail'], {queryParams:{pageSummaryByStatus:this.pageSummaryByStatus}});
  }

  paginate(event)
  {
    console.log("paginate event = " , event);
    this.offset = Number(event.first);
    this.limit = Number(event.rows);
    console.log("offset = " , this.offset , " , limit = " , this.limit);
    this.loader = true;
    this.getProgressBar();
     if (this.limit > this.totalCount)
        this.limit = Number(this.totalCount);
       if ((this.limit + this.offset) > this.totalCount)
             this.limit = Number(this.totalCount) - Number(this.offset);

    this.commonService.isFilterFromNSSideBar = true;
    this.getPageSummaryData();
  
  }
  /** Method for progressbar */
  getProgressBar() {
    this.value =1;
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(interval);
      }
    }, 300);
  }
  // Formatter for large values coming as comma seperated

  formatter(data: any) {
    if(Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }

  /**Formatter cell data for converting ms to sec field */

  msToTimeFormat(duration) 
  {
    if (!isNaN(duration))
    {
      var milliseconds , seconds , minutes , hours , temp, time;
      time = +duration;
      time = Math.round(time);
      milliseconds = time%1000;
      time = (time - milliseconds)/1000;
      hours = parseInt(Number(time/3600)+'');
      time = time%3600;
      minutes = parseInt(Number(time/60)+'');
      time = time%60;
      seconds = parseInt(Number(time)+'');
      return(this.appendStringToTime(hours,minutes,seconds,milliseconds));
    }
    else
      return duration;
  }

  appendStringToTime(hh,mm,ss,msec)
  {
    if (msec < 10)
      msec = "0" + msec;
    if (msec < 100)
      msec = "0" + msec;
    if (mm < 10)
      mm = "0" + mm;
    if (ss < 10)
      ss = "0" + ss;
    if (hh < 10)
      hh = "0" + hh; // Make hrs 2 digit string

    return (hh + ":" + mm + ":" + ss + "." + msec);
  }

  customSortOnColumns(event, tempData) {
    if (event.order == -1) {
                   var temp = (event["field"]);
                   event.order = 1; //desending order
                   console.log('temp datattaaa ', temp);
                   tempData = tempData.sort(function (a, b) {
                       var value = Number(a[temp].replace(/[:.,]/g, ''));
                       var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                       
                       return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                   });
               }
               else {
                   var temp = (event["field"]);
                   event.order = -1; //asecding order
                   tempData = tempData.sort(function (a, b) {
                       var value = Number(a[temp].replace(/[:.,]/g, ''));
                       var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                       
                       return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                   });
               }
         this.pageSummaryData = [];
           //console.log(JSON.stringify(tempData));
           if (tempData) {
               tempData.map((rowdata) => { this.pageSummaryData = this.Immutablepush(this.pageSummaryData, rowdata) });
           }
   
       }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  setTestRunHeader()
  {
    if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm') {
      if(this.pageSummaryByStatus == true)
        this.strTitle = 'Netstorm - Page Summary By Status Report - Test Run : ' + this.urlParam.testRun;
      else
        this.strTitle = 'Netstorm - Page Summary Report - Test Run : ' + this.urlParam.testRun;
    } 
    else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud'){
     if(this.pageSummaryByStatus == true)
      this.strTitle = 'NetCloud - Page Summary By Status Report - Test Run : ' + this.urlParam.testRun;
    else
      this.strTitle = 'NetCloud - Page Summary Report - Test Run : ' + this.urlParam.testRun;
    }
    else {
      if(this.pageSummaryByStatus == true)
        this.strTitle = 'Netdiagnostics Enterprise - Page Summary By Status Report - Session : ' + this.urlParam.testRun;
      else
        this.strTitle = 'Netdiagnostics Enterprise - Page Summary Report - Session : ' + this.urlParam.testRun;
    }
  }

  downloadReport(type:string)
  {
    this.pageSummaryData.forEach((val, index) => {
      delete val['pageIndex'];
      delete val['statusCode'];

      if(this.colOrder.indexOf('Status')==-1)
      delete val['statusName'];
      else
      delete val['failPercent'];

      if(this.colOrder.indexOf('Generator Name')==-1)
      delete val['generatorName'];
      
      if(this.colOrder.indexOf('Transaction Name')==-1)
      delete val['transactionName'];
      
      if(this.colOrder.indexOf('Script Name')==-1)
      delete val['scriptName']; 
      else 
      delete val['scriptCount'];

      val['min'] = this.msToTimeFormat(val['min']);
      val['max'] = this.msToTimeFormat(val['max']);
      val['avg'] = this.msToTimeFormat(val['avg']);
      val['median'] = this.msToTimeFormat(val['median']);
      val['percent80'] = this.msToTimeFormat(val['percent80']);
      val['percent90'] = this.msToTimeFormat(val['percent90']);
      val['percent95'] = this.msToTimeFormat(val['percent95']);
      val['percent99'] = this.msToTimeFormat(val['percent99']);
    });

  //  console.log( " this.cols==>", this.colOrder, "this.renamearaay==>",this.renameArr,"pageSummaryData for download **  " , this.pageSummaryData);
    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'PageSummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(this.renameArr),
      colOrder: this.colOrder.toString(),
      jsonData: JSON.stringify(this.pageSummaryData)
    };

    let downloadFileUrl =decodeURIComponent(this.getHostUrl(true)+'/'+ this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl,downloadObj).subscribe(res =>(this.openDownloadReports(res)));
    else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>(this.openDownloadReports(res)));
    
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open(decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
  }

  ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.subscribePage.unsubscribe();
  this.commonService.isCQM=false;
  this.commonService.isToLoadSideBar=false;
}
showMessage(mssg: any) {
  this.msgs = [];
  if(mssg=="Query Saved")
  this.msgs.push({ severity: 'success', summary: 'Success Message', detail: mssg });
  else if(mssg=="Query Already Defined")
  this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
  else
  this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
}

  
    
randomNumber(){
  this.queryId = (Math.random() * 1000000).toFixed(0);
  console.log("queryId:::::::::::::"+this.queryId);
}
waitQuery()
{
  this.isCancelQuery = false;
  setTimeout(() => {
    this.openpopup();
}, this._ddrData.guiCancelationTimeOut);
}

onCancelQuery(){
    let url = "";
   url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.urlParam.testRun +"&queryId="+this.queryId;  
  console.log("Hello u got that",url);
    this.isCancelQuery = false;
     this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
  }

  openpopup(){
    if(!this.isCancelQuerydata)
    this.isCancelQuery =true;
  }

}

export interface PageSummaryInterface {
  pageName : string;
  pageIndex : string;
  scriptCount : string;
  tried : string;
  success : string;
  fail : string;
  failPercent : string;
  min : string;
  max : string;
  avg : string;
  median : string;
  percent80 : string;
  percent90 : string;
  percent95 : string;
  percent99 : string;
  status : string;
  statusCode : string;
  statusName: string;
  generatorName: string;
  transactionName: string;
}
