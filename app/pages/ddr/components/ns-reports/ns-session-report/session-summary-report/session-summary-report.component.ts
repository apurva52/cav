import { CommonServices } from '../../../../services/common.services';
import { Component, Input, OnInit } from '@angular/core';
import { SessionSummaryInterface, SelectItem } from '../interfaces/ns-session-info';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { Router } from '@angular/router';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { NsCommonService } from '../../services/ns-common-service';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../../../services/ddr-request.service';
import {Message} from 'primeng/primeng';
@Component({
    selector: 'session-summary-report',
    templateUrl: 'session-summary-report.component.html',
    styleUrls: ['session-summary-report.component.scss']
})
export class SessionSummaryReportComponent implements OnInit {
    @Input() summaryReportByStatus: boolean;
    data: Array<SessionSummaryInterface>;
    strGroupBy: string;
    limit: number = 50;
    offset: number = 0;
    url: any;
    commonUrl='';
    count : any;
    cols: any;
    id: any;
    visibleCols: any[];
    columnOptions: SelectItem[];
    prevColumn;
    isEnabledColumnFilter = true;
    toggleFilterTitle = '';
    filterCriteria: string = "";
    loading = false;
    strTitle:any;
    subscribeSession: Subscription;
    screenHeight: number;
    toolTipStatus: string='';
    toolTipUrl: string='';
    filterStatus: string='';
    filterUrl: string='';
    width:number;
    renameArray: { 'scriptName': string; 'tried': string; 'success': string; 'fail': string; 'min': string; 'average': string; 'max': string; 'median': string; 'percent80': string; 'percent90': string; 'percent95': string; 'percent99': string; };
    colOrder: string[];
    msgs: Message[] = [];
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;
    loader: boolean;
    value: number;
    constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
        private _router: Router, private _cavConfigService: CavConfigService,
        private nsCommonData: NsCommonService, private breadcrumbService: DdrBreadcrumbService, private _ddrData: DdrDataModelService,
        private ddrRequest:DDRRequestService) {

    }
    ngOnInit() {
        this.loading = true;
        this.id = this.commonService.getData();
        if (this.summaryReportByStatus)
            this.strGroupBy = 'status';
        this.commonService.currentReport="Session Summary";
        this.randomNumber();
        this.screenHeight = Number(this.commonService.screenHeight)-100; 
        this.commonService.isToLoadSideBar=true;
  
        this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
        console.log("this.commonservice.nsSessionSummary==>",this.commonService.nsSessionSummary); 
      
        this.subscribeSession=this.commonService.sideBarUIObservable$.subscribe((temp)=>{
            if(this.commonService.currentReport=="Session Summary")
            {
            this.loading = true;   
            this.getSessionSummaryData();
            this.makeTableColumns();
            }
        })
        this.getSessionSummaryData();
        this.makeTableColumns();
        this.setTestRunInHeader();
        this._ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessage(mssg)});
    }
    getSessionSummaryData() {
        let ajaxParam = '';
        this.url = "";
        if(this.commonService.enableQueryCaching == 1){
            this.url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionSummary?cacheId='+ this.id.testRun + '&testRun=' + this.id.testRun;
        }
        else{
            this.url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionSummary?testRun=' + this.id.testRun;
        }
        if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsSessionSummary).length!=0)
          {   if (this.summaryReportByStatus)
            {
              let group=[]
              group=this.commonService.nsSessionSummary['strGroupBy'];
              if( group[0]=='' || group[0]==undefined)
              { 
                group[0]='status';
              }
              this.commonService.nsSessionSummary['strGroupBy']=group;
            }
            ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsSessionSummary);
            this.commonService.isCQM = true;       //for summary to store filter cqm in breadcrumb case.
            // for FIlter CQM case    so that will update value in key pair.
            this._ddrData.nsCQMFilter[this.commonService.currentReport] = this.commonService.nsSessionSummary;
            console.log("inside first cond==>", this.commonService.isCQM);
          }
          
        else {
            ajaxParam ='&startTime=' + this.id.startTime + '&endTime=' + this.id.endTime +
                '&userName=' + this._ddrData.userName +
                '&strGroupBy=' + this.strGroupBy+
                '&status=-2';
        if (this._ddrData.nsErrorName){
             ajaxParam +='&nsErrorName=' + this._ddrData.nsErrorName ;
          }

        // if(this._ddrData.groupName=="Session"  && this._ddrData.vectorName!='undefined'&& this._ddrData.vectorName!=undefined )
        // ajaxParam += '&script=' + this._ddrData.vectorName;
        
        if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        ajaxParam += '&groupName=' +this._ddrData.vectorName;
       if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        ajaxParam += '&generatorName=' +this._ddrData.generatorName;

           // this.commonService.nsSessionSummary = this.commonService.makeObjectFromUrlParam(ajaxParam);
        }
        if(this.commonService.isCQM)
    {
      console.log("inside data of session summary==>",this._ddrData.nsCQMFilter);
      //this.commonService.nsTransactionSummary=this._ddrData.nsCQMFilter[this.commonService.currentReport];
      ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsSessionSummary,true);
      this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsSessionSummary;
      console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);
      console.log("ajax param are==>",ajaxParam);
    }
        else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
            this.commonService.isCQM = true;
            console.log("inside else cond===> ", this._ddrData.nsCQMFilter[this.commonService.currentReport])
            ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
        }
    this.commonService.nsSessionSummary = this.commonService.makeObjectFromUrlParam(ajaxParam);
        console.log("ajaxParam====>",ajaxParam);
        this.commonUrl= this.url+ajaxParam;
        let finalUrl = this.commonUrl + '&limit=' + this.limit + '&offset=' + this.offset + '&showCount=false'+ '&queryId='+this.queryId;
        setTimeout(() => {
            this.openpopup();
           }, this._ddrData.guiCancelationTimeOut);
        this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => (this.doAssignValues(data)));
    }

    doAssignValues(res: any) {
    this.isCancelQuerydata =true;
       this.commonService.isFilterFromNSSideBar=false;
        this.data = res.data;
        console.log("datataa--",this.data);
        if(!this.data){
            this.loading = false;
            this.loader = false;
            return;
        }
        else{
            setTimeout(() => {
                this.loading = false;
                this.loader = false;
            }, 1000);
        }
        this.showfilterCriteria(res.strStartTime, res.strEndTime);
        this.commonService.customTimePlaceHolder=[];
        this.commonService.customTimePlaceHolder.push(res.strStartTime, res.strEndTime);
        this.makeajaxcallCount();
    }

    /*Method is used get host url*/
    getHostUrl(isDownloadCase?): string {
        var hostDcName = this._ddrData.getHostUrl();
        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
            this.id.testRun = this._ddrData.testRun;
            console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
        }
        console.log('hostDcName getHostURL =', hostDcName);
        return hostDcName;
    }

    makeTableColumns() {

        this.cols = [
            { field: 'scriptName', header: 'Script Name', sortable: true, action: true, width: '30' },
            { field: 'tried', header: 'Tried', sortable: 'custom', action: true, width: '20' },
            { field: 'success', header: 'Success', sortable: 'custom', action: true, width: '20' },
            { field: 'fail', header: 'Fail', sortable: true, action: true, width: '15' },
            { field: 'min', header: 'Min', sortable: 'custom', action: true, width: '30' },
            { field: 'average', header: 'Average', sortable: 'custom', action: true, width: '30' },
            { field: 'max', header: 'Max', sortable: 'custom', action: true, width: '30' },
            { field: 'median', header: 'Median', sortable: 'custom', action: true, width: '30' },
            { field: 'percent80', header: '80%tile', sortable: 'custom', action: true, width: '30' },
            { field: 'percent90', header: '90%tile', sortable: 'custom', action: true, width: '30' },
            { field: 'percent95', header: '95%tile', sortable: 'custom', action: true, width: '30' },
            { field: 'percent99', header: '99%tile', sortable: 'custom', action: true, width: '30' }
            
        ];
        this.visibleCols = ['scriptName', 'tried', 'success', 'fail', 'min', 'average', 'max', 'median', 'percent80', 'percent90', 'percent95', 'percent99'];

        this.renameArray = { 'scriptName': 'Script Name',  'tried': 'Tried', 'success': 'Success', 'fail': 'Fail', 'min': 'Min', 'average': 'Average', 'max': 'Max', 'median': 'Median', 'percent80': '80%tile', 'percent90': '90%tile', 'percent95': '95%tile', 'percent99': '99%tile' }

        this.colOrder = ['Script Name','Tried', 'Success', 'Fail', 'Min', 'Max', 'Average', 'Median', '80%tile', '90%tile', '95%tile', '99%tile'];


        if (this.commonService.nsSessionSummary['strGroupBy'] && this.commonService.nsSessionSummary['strGroupBy'].indexOf('status') != -1) {
            this.cols.push({ field: 'statusName', header: 'Status', sortable: true, action: true, width: '30' })
            this.visibleCols.push("statusName");

            this.renameArray['statusName'] = 'Status';
            this.colOrder.push('Status');
        }
        else {
            this.cols.push({ field: 'percentFail', header: '%Fail', sortable: 'custom', action: true, width: '20' })
            this.visibleCols.push('percentFail');
            this.renameArray['percentFail'] = '%Fail';
            this.colOrder.push('%Fail');
        }
        if (this.commonService.nsSessionSummary['strGroupBy'] && this.commonService.nsSessionSummary['strGroupBy'].indexOf('generator') != -1) {
            this.cols.push({ field: 'generatorName', header: 'Generator Name', sortable: 'custom', action: true, width: '30' })
            this.visibleCols.push('generatorName');
            this.renameArray['generatorName'] = 'Generator Name';
            this.colOrder.push('Generator Name');
        }
      console.log("this.cols",this.cols)
      console.log("this.visibleCols",this.visibleCols)
      console.log("this.renameArray",this.renameArray)
      console.log("this.colOrder",this.colOrder)
        // this.cols.forEach(data => {
        //     if (this.commonService.nsSessionSummary['group'] && this.commonService.nsSessionSummary['group'].indexOf('generator') != -1  && data.field == "GeneratorName") {
            
        //       data.action = true;
        //       //this.visibleCols.push(data.field);
        //     }
        //     if (this.commonService.nsSessionSummary['group'] && this.commonService.nsSessionSummary['group'].indexOf('status') != -1  && data.field == "statusName") {
            
        //         data.action = true;
        //         if(this.visibleCols['statusName'].indexOf() == -1)
        //         this.visibleCols.push(data.field);
        //       }
        //   });
        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
        }
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
                for (let j = 0; j < this.visibleCols.length; j++) {
                    if (this.cols[i].field === this.visibleCols[j]) {
                        this.cols[i].action = true;
                        break;
                    } else {
                        this.cols[i].action = false;
                    }
                }
            }
        }
   let n=this.visibleCols.length;
   this.width=1240/n;
    }
    /**Formatter cell data for converting ms to sec field */
    msToTimeFormate(duration) {
        if (!isNaN(duration)) {
            var milliseconds, seconds, minutes, hours, temp, time;

            time = +duration;
            time = Math.round(time);
            milliseconds = time % 1000;
            time = (time - milliseconds) / 1000;
            hours = parseInt(Number(time / 3600) + '');
            time = time % 3600;
            minutes = parseInt(Number(time / 60) + '');
            time = time % 60;
            seconds = parseInt(Number(time) + '');
            return (this.appendStringToTime(hours, minutes, seconds, milliseconds));
        }
        else
            return duration;
    }
    appendStringToTime(hh, mm, ss, msec) {
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


  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilter() {
    if (this.isEnabledColumnFilter) {
      this.isEnabledColumnFilter = false;
    } else {
      this.isEnabledColumnFilter = true;
    }
    this.changeColumnFilter();
  }


 /*This method is used to Enable/Disabled Column Filter*/
 changeColumnFilter() {
  try {
    let tableColumns = this.cols;
    if (this.isEnabledColumnFilter) {
      this.toggleFilterTitle = 'Show Filters';
      for (let i = 0; i < tableColumns.length; i++) {
        tableColumns[i].filter = false;
      }
    } else {
      this.toggleFilterTitle = 'Hide Filters';
      for (let i = 0; i < tableColumns.length; i++) {
        tableColumns[i].filter = true;
      }
    }
  } catch (error) {
    console.log('Error while Enable/Disabled column filters', error);
  }
}




    showfilterCriteria(startTime: any, endTime: any) {
        this.filterCriteria='';
        this.toolTipStatus='';
        this.toolTipUrl='';
        this.filterStatus='';
        this.filterUrl='';
        let sessionParam = this.commonService.nsSessionSummary ;
        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
            this.filterCriteria += "DC=" + this._ddrData.dcName;
        if (!this.commonService.isValidParamInObj(sessionParam, 'phaseName'))
        {
        if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
            this.filterCriteria += ', From=' + startTime;
        }
        if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
            this.filterCriteria += ', To=' + endTime;
        }
        }
        
        if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
        this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;

        if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

        if (this.commonService.isValidParamInObj(sessionParam, 'script'))
            this.filterCriteria += ", script=" + sessionParam.script;
        if (this.commonService.isValidParamInObj(sessionParam, 'url'))
        { 
            let url=sessionParam['url'];
            if(url && url.length>=20)
            {
              this.toolTipUrl+="Url= "+sessionParam['url'];
              url=url.substring(0,19);
              this.filterUrl += ", url=" + url+" ....";
            }
            else
            this.filterUrl += ", url=" + url;
          }
        if (this.commonService.isValidParamInObj(sessionParam, 'transactionName'))
        this.filterCriteria += ", transactionName=" + sessionParam.transactionName;      
        if (this.commonService.isValidParamInObj(sessionParam, 'page'))
        this.filterCriteria += ", page" + sessionParam.page          
        if (this.commonService.isValidParamInObj(sessionParam, 'location'))
        this.filterCriteria += ", location=" + sessionParam.location
        if (this.commonService.isValidParamInObj(sessionParam, 'access'))
        this.filterCriteria += ", access=" + sessionParam.access
        if (this.commonService.isValidParamInObj(sessionParam, 'browser'))
        this.filterCriteria += ", browser=" + sessionParam.browser 
        if (this.commonService.isValidParamInObj(sessionParam, 'strGroupBy'))
        this.filterCriteria += ", group=" + sessionParam.strGroupBy
        if (this.commonService.isValidParamInObj(sessionParam, 'order'))
        this.filterCriteria += ", order=" + sessionParam.order
        if (this.commonService.isValidParamInObj(sessionParam, 'statusName'))
        {
            let status=sessionParam['statusName'];
            if(status && status.length>=20)
            {
              this.toolTipStatus+="Status= "+sessionParam['statusName'];
              status=status.substring(0,19);
              this.filterStatus += ", Status=" + status+ " ....";
            }
            else
            this.filterStatus += ", Status=" + status;
           
        }
        if (this.commonService.isValidParamInObj(sessionParam, 'phaseName'))
        this.filterCriteria += ", Phase Name=" + sessionParam.phaseName;
        //this.filterCriteria += ", Status=" + sessionParam.statusName;
        if (this.filterCriteria.startsWith(',')) {
            this.filterCriteria = this.filterCriteria.substring(1);
        }
    }

     makeajaxcallCount() {
    let countUrl = this.commonUrl + '&showCount=true';
    this.ddrRequest.getDataUsingGet(countUrl).subscribe(data => { (this.assignCountData(data)) });
  }
  assignCountData(countdata) {
    this.count = countdata.totalCount;
    if (this.limit > this.count)
      this.limit = Number(this.count);
    console.log("countdata", countdata);
  }

  paginate(event) {
    
      this.offset = parseInt(event.first);
      this.limit = parseInt(event.rows);
    
      if (this.limit > this.count)
      this.limit = Number(this.count);
      this.loader = true;
      this.getProgressBar();
      if ((this.limit + this.offset) > this.count)
      this.limit = Number(this.count) - Number(this.offset);
      this.getSessionSummaryData();
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
    openInstanceReport(nodeData, success?: string) {
        this._ddrData.nsCQMFilter["Session Instance"]=undefined;
        this.nsCommonData.currRowData = nodeData;
        this.nsCommonData.sessionIndex = undefined;
        this.nsCommonData.isFromSummary = true;
        if (success == 'Success')
            this.nsCommonData.sessionIndex = '0';
        else
            this.nsCommonData.sessionIndex = '-2';
        this.nsCommonData.isSuccess = success;
        if (this.summaryReportByStatus) {
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_STATUS;
            this._ddrData.errorNameSession = nodeData.statusName;
            this._ddrData.errorUserSession = nodeData.statusName;
            this._ddrData.fromReport = true;
        }
        else {
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_SUMMARY;
            this._ddrData.errorNameSession = undefined;
            this._ddrData.errorUserSession = undefined;
            this._ddrData.fromReport = false;
        }
    //CQM case
            if (this.commonService.isCQM) {
            this.commonService.nsSessionInstance = JSON.parse(JSON.stringify(this.commonService.nsSessionSummary));
            this.commonService.nsSessionInstance['wanEnv'] = 0;
            if (this.commonService.nsSessionInstance['script']) {
                this.commonService.nsSessionInstance['scriptName'] = this.commonService.nsSessionInstance['script'];
            } 
            if (!this.commonService.nsSessionInstance.scriptName)   //incase no filter for script has been provided.
                {
                    this.commonService.nsSessionInstance['scriptName'] = this.nsCommonData.currRowData['scriptName'];
                    this.commonService.nsSessionInstance['scriptidx'] = this.nsCommonData.currRowData['sessionIndex'];
                }
              this.commonService.nsSessionInstance['strStatus']= this.commonService.nsSessionInstance['status'];
              delete this.commonService.nsSessionInstance['status'];
              if(this.commonService.nsSessionInstance['strGroupBy'] && this.commonService.nsSessionInstance['order'])
              this.commonService.nsSessionInstance=this.commonService.filterGroupOrder(this.commonService.nsSessionInstance);
              else
              delete this.commonService.nsSessionInstance['strGroupBy'];
              
              if (success == 'Success')
              this.commonService.nsSessionInstance['strStatus'] = '0';
              this.commonService.isFromSessionSummary=true;
             
              if(nodeData['status'] && nodeData['status']!="-" && nodeData['status']!="NA")
              {
                this.commonService.nsSessionInstance['strStatus']=nodeData['status'];
              } 
              console.log("going out of summary to instance==>",this.commonService.nsSessionInstance);
            }
            this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Session Instance');     
            this._router.navigate(['/home/ddr/nsreports/sessionInstance']);
    }
    openFailureReport(nodeData) {
        this._ddrData.nsCQMFilter["Session Failure"]=undefined;
        this.nsCommonData.currRowData = nodeData;
        if (this.summaryReportByStatus) {
            this.nsCommonData.sessionIndex = nodeData.status;
            this.nsCommonData.isSuccess = nodeData.statusName;
            this.nsCommonData.isFromSummary = true;
            this._ddrData.errorNameSession = nodeData.statusName;
            this._ddrData.errorUserSession = nodeData.statusName;
            this._ddrData.fromReport = true;
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_STATUS;
            //this._router.navigate(['/home/ddr/nsreports/sessionInstance']);
        }
        else {
            this._ddrData.errorUserSession = undefined;
            this._ddrData.errorNameSession = undefined;
            this._ddrData.fromReport = false;
            this.nsCommonData.failureType = nodeData.sessionIndex;
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_SUMMARY;
           // this._router.navigate(['/home/ddr/nsreports/sessionFailure']);
        }
        if(this.commonService.isCQM)
        {
            if (this.summaryReportByStatus) {
              this.commonService.nsSessionInstance=JSON.parse(JSON.stringify(this.commonService.nsSessionSummary));
              this.commonService.nsSessionInstance['wanEnv']=0;
                if (!this.commonService.nsSessionInstance.scriptName)   //incase no filter for script has been provided.
                {
                    this.commonService.nsSessionInstance['scriptName'] = this.nsCommonData.scriptName;
                    this.commonService.nsSessionInstance['scriptidx'] = this.nsCommonData.currRowData['sessionIndex'];
                }
                this.commonService.nsSessionInstance['strStatus']= this.commonService.nsSessionInstance['status'];
                delete this.commonService.nsSessionInstance['status'];
                delete this.commonService.nsSessionInstance['strGroupBy'];

        }
        else
        { 
        this.commonService.nsSessionFailure=JSON.parse(JSON.stringify(this.commonService.nsSessionSummary));    
        this.commonService.nsSessionFailure['wanEnv']='NA';
        if(this.commonService.nsSessionFailure.status==0 || this.commonService.nsSessionFailure==-2)
        this.commonService.nsSessionFailure.status=-1;
        this.commonService.nsSessionFailure['objectId'] = this.nsCommonData.failureType;
        //failure type stores session index?   if script filter provided the will open report for that particular script and the script index will be same as the row data .sessionindex
                if (this.commonService.nsSessionFailure.script) {
                    this.commonService.nsSessionFailure['scriptName']=this.commonService.nsSessionFailure.script;
                    delete this.commonService.nsSessionFailure.script;
                }
                else   //incase no filter for script has been provided.
                {
                    this.commonService.nsSessionFailure['scriptName'] = this.nsCommonData.currRowData["scriptName"];
                }
                    if (this.commonService.nsSessionInstance['strStatus'] == -2 || this.commonService.nsSessionInstance['strStatus'] == -0) {
                        this.commonService.nsSessionInstance['strStatus'] = -1;
                    }
                    //'&objectType=3
        if(nodeData['status']!="-")
        {
          this.commonService.nsSessionInstance['strStatus']=nodeData['status'];
        }
        delete this.commonService.nsSessionFailure['scriptidx'];  
        delete this.commonService.nsSessionFailure['strGroupBy'];
        delete this.commonService.nsSessionFailure['order']; 
        this.commonService.nsSessionFailure['objectType']=3;         //added cz in session summary the object =3 is added on rest side.
        
       }
        console.log(" this.commonService.nsSessionFailure==>",this.commonService.nsSessionFailure, "  this.commonService.nsSessionInstance====>",this.commonService.nsSessionInstance);
        this.commonService.isFromSessionSummary=true;

    }

        if (this.summaryReportByStatus) {
            this.commonService.nsAutoFillSideBar(this.commonService.currentReport, 'Session Instance');
            this._router.navigate(['/home/ddr/nsreports/sessionInstance']);

        }
        else {
            this.commonService.nsAutoFillSideBar(this.commonService.currentReport, 'Session Failure');
            this._router.navigate(['/home/ddr/nsreports/sessionFailure']);
        }
    }
    openSessionDetailReport(nodeData,) {
        this.nsCommonData.currRowData = nodeData.scriptName;
        this.nsCommonData.sessionIndex = undefined;
        this.nsCommonData.avgTime = this.msToTimeFormate(nodeData.average);
        if (this.summaryReportByStatus) {
            this.nsCommonData.isSuccess = nodeData.statusName;
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_STATUS;
        }
        else
            this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_SUMMARY;
        this._router.navigate(['/home/ddr/nsreports/sessionDetail']);
    }
    openSessionName(nodeData) {
        let url = this.getHostUrl() + '/' + this.id.product +
            '/recorder/recorder.jsp?openFrom=TR' + this.id.testRun +
            '&scriptName=' + nodeData + "&sesLoginName=" + sessionStorage.getItem('sesLoginName');
        console.log('JNLP Launcher url ', url, "    node data ",nodeData);

        window.open(url, "_blank");
    }

    customsortOnColumns(event, tempData) {
            if (event.order == -1) {
                var temp = (event["field"]);
                event.order = 1
                console.log('temp datattaaa ', temp);
                tempData = tempData.sort(function (a, b) {
                        var value = Number(a[temp].replace(/[:.,]/g, ''));
                        var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                    return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                });
            }
            else {
                var temp = (event["field"]);
                event.order = -1;
                //asecding order
                tempData = tempData.sort(function (a, b) {
                        var value = Number(a[temp].replace(/[:.,]/g, ''));
                        var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                    return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                });
            }
        this.data = [];
        //console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.data = this.Immutablepush(this.data, rowdata) });
        }

    }
    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }

    formatter(data: any) {
        if(Number(data) && Number(data) > 0) {
          return Number(data).toLocaleString();
        } else {
          return data;
        }
      }


      setTestRunInHeader(){
        if (this.id && this.id.product.toLowerCase() == 'netstorm') {
          if(this.summaryReportByStatus)
          this.strTitle = 'Netstorm - Session Summary By Status Report - Test Run : ' + this.id.testRun;
          else
          this.strTitle = 'Netstorm - Session Summary Report - Test Run : ' + this.id.testRun;
        }
        else if(this.id && this.id.product.toLowerCase() == 'netcloud') {
            if(this.summaryReportByStatus)
            this.strTitle = 'NetCloud - Session Summary By Status Report - Test Run : ' + this.id.testRun;
            else
            this.strTitle = 'NetCloud - Session Summary Report - Test Run : ' + this.id.testRun;   
        }
        else {
          if(this.summaryReportByStatus)
          this.strTitle = 'Netdiagnostics Enterprise - Session Summary By Status Report - Session : ' + this.id.testRun;
          else
          this.strTitle = 'Netdiagnostics Enterprise - Session Summary Report - Session : ' + this.id.testRun;
        }
      }





/** Download report for Session Summary  */
downloadReports(reports: string) {
 // let renameArray;
 // let colOrder;
  let downloadSummaryInfo =JSON.parse(JSON.stringify(this.data));
 // console.log("SessionSummaryData=========== ", JSON.stringify(this.data));
//   if(this.summaryReportByStatus) {
//     renameArray = {'scriptName': 'Script Name','statusName': 'Status','tried': 'Tried', 'success': 'Success', 'fail': 'Fail','min': 'Min','average': 'Average','max': 'Max','median': 'Median','percent80': '80%tile','percent90': '90%tile','percent95': '95%tile','percent99': '99%tile'}
        
//     colOrder = ['Script Name','Status','Tried','Success','Fail','Min','Max','Average','Median','80%tile','90%tile','95%tile','99%tile'];

//     if(downloadSummaryInfo[0]['GeneratorName']){
//         renameArray['GeneratorName'] = 'Generator Name';
//         colOrder.push('Generator Name');
//      }
     
//     downloadSummaryInfo.forEach((val, index) => {
//         delete val['sessionIndex'];
//         delete val['percentFail'];  
//         delete val['status'];      

//         val['min']= this.msToTimeFormate(val['min']);
//         val['max']= this.msToTimeFormate(val['max']);
//         val['average']= this.msToTimeFormate(val['average']);
//         val['median']= this.msToTimeFormate(val['median']);
// 		val['percent80']= this.msToTimeFormate(val['percent80']);
//         val['percent90']= this.msToTimeFormate(val['percent90']);
//         val['percent95']= this.msToTimeFormate(val['percent95']);
//         val['percent99']= this.msToTimeFormate(val['percent99']);
       
//             }); 
 
//         }else{
//             renameArray = {'scriptName': 'Script Name','tried': 'Tried', 'success': 'Success', 'fail': 'Fail','percentFail': '%Fail','min': 'Min','average': 'Average','max': 'Max','median': 'Median','percent80': '80%tile','percent90': '90%tile','percent95': '95%tile','percent99': '99%tile'}
        
//             colOrder = ['Script Name','Tried','Success','Fail','%Fail','Min','Max','Average','Median','80%tile','90%tile','95%tile','99%tile'];
//            //console.log("SessionSummaryData=========== ", JSON.stringify(downloadSummaryInfo));

//            if(downloadSummaryInfo[0]['GeneratorName']){
//             renameArray['GeneratorName'] = 'Generator Name';
//             colOrder.push('Generator Name');
//          }
//            downloadSummaryInfo.forEach((val, index) => {
//                 delete val['sessionIndex'];
//                 delete val['statusName'];
//                 delete val['status'];
//                 val['min']= this.msToTimeFormate(val['min']);
//                 val['max']= this.msToTimeFormate(val['max']);
//                 val['average']= this.msToTimeFormate(val['average']);
//                 val['median']= this.msToTimeFormate(val['median']);
//                 val['percent80']= this.msToTimeFormate(val['percent80']);
//                 val['percent90']= this.msToTimeFormate(val['percent90']);
//                 val['percent95']= this.msToTimeFormate(val['percent95']);
//                 val['percent99']= this.msToTimeFormate(val['percent99']);               
//                     });
//         }

           downloadSummaryInfo.forEach((val, index) => {
                delete val['sessionIndex'];
                delete val['status'];
                if(this.colOrder.indexOf('Status') ==-1 )
                delete val['statusName'];
                 else
                delete val['percentFail'];

                if(this.colOrder.indexOf('Generator Name') == -1 )
                delete val['generatorName'];
                
                val['min']= this.msToTimeFormate(val['min']);
                val['max']= this.msToTimeFormate(val['max']);
                val['average']= this.msToTimeFormate(val['average']);
                val['median']= this.msToTimeFormate(val['median']);
                val['percent80']= this.msToTimeFormate(val['percent80']);
                val['percent90']= this.msToTimeFormate(val['percent90']);
                val['percent95']= this.msToTimeFormate(val['percent95']);
                val['percent99']= this.msToTimeFormate(val['percent99']);               
                    });
      console.log("rename array===>",this.renameArray ,"colOrder==>",this.colOrder);
      console.log("downloadSummaryInfo=====>",downloadSummaryInfo)
      let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'SessionSummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(this.renameArray),
      colOrder: this.colOrder.toString(),
      jsonData: JSON.stringify(downloadSummaryInfo)
    };
    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product) +
      '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
        if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
        else
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
    }


    openDownloadReports(res) {
        console.log('file name generate ===', res);
        window.open(decodeURIComponent(this.getHostUrl(true)) + '/common/' + res);
    }
 ngOnDestroy(): void {
      //Called once, before the instance is destroyed.
      //Add 'implements OnDestroy' to the class.
      this.subscribeSession.unsubscribe();
      this.commonService.isToLoadSideBar=false;
      this.commonService.isCQM=false;
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
     url = decodeURIComponent(this.getHostUrl() + '/' + this.id.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.id.testRun +"&queryId="+this.queryId;  
    console.log("Hello u got that",url);
      this.isCancelQuery = false;
       this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
    }
  
    openpopup(){
      if(!this.isCancelQuerydata)
      this.isCancelQuery =true;
    }
}
