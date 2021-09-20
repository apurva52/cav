import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { SelectItem, SessionInstanceInterface } from '../interfaces/ns-session-info';
import { NsCommonService } from '../../services/ns-common-service';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { Subscription } from 'rxjs';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'session-instance-report',
    templateUrl: 'session-instance-report.component.html',
    styleUrls: ['session-instance-report.component.scss']
})
export class SessionInstanceReportComponent {
    cols: any;
    cols1: any;
    id: any;
    visibleCols: any[];
    visibleCols1: any[];
    columnOptions: SelectItem[];
    columnOptions1: SelectItem[];
    prevColumn;
    filterCriteria = "";
    data: Array<SessionInstanceInterface>;
    isFromSummary: boolean = false;
    limit = 50;
    offset = 0;
    totalCount;
    showCount = false;
    tableData: any;
    loading = false;
    strTitle:any;
    subscribeSession:Subscription;
    screenHeight: number;
    toolTipStatus: string='';
    toolTipUrl: string='';
    filterStatus: string='';
    filterUrl: string='';
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;
    value: number;
    loader: boolean;
    constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
        private _router: Router, private _cavConfigService: CavConfigService, private ddrdata: DdrDataModelService,
        private nsCommonData: NsCommonService, private breadcrumbService: DdrBreadcrumbService, public _ddrData: DdrDataModelService,
        private ddrRequest:DDRRequestService) {

    }
    ngOnInit() {
        console.log('Session Instance is loaded ');
        this.loading = true;
        this.id = this.commonService.getData();
        console.log('ddrdata  **** ', this.ddrdata);
        if (this.ddrdata.summaryToInstanceFlag === 'true')
            this.nsCommonData.isFromSummary = true;
        else if (this.ddrdata.summaryToInstanceFlag === 'false')
            this.nsCommonData.isFromSummary = false;
       this.screenHeight = Number(this.commonService.screenHeight)-100;
       this.isFromSummary = this.nsCommonData.isFromSummary;
       this.randomNumber();
       this.commonService.currentReport="Session Instance";
       this.commonService.isToLoadSideBar=true;
       this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
       console.log("this.commonservice.nsSessionInstance==>",this.commonService.nsSessionInstance); 
   
       this.subscribeSession=this.commonService.sideBarUI$.subscribe((temp)=>{
           if (this.commonService.currentReport == "Session Instance") {
               this.loading = true;
               this.limit = 50;
               this.offset = 0;
               let event = [];
               event['first']=this.offset;
               event['rows']=this.limit;
               this.paginate(event);
               this.getSessionInstanceData();
              // this.makeTableColumns();
           }
        })
        this.getSessionInstanceData();
       // this.makeTableColumns();
        this.setTestRunInHeader();
    }

    makeTableColumns() {
        this.cols = [{ field: 'scriptName', header: 'Script Name', sortable: true, action: true, width: '20' }];
        console.log('this.ddrdata.currRowData ', this.nsCommonData.currRowData);
        if (this._ddrData.WAN_ENV > 0) {
            // this.nsCommonData.isFromSummary = true;
            this.cols = this.cols.concat({ field: 'location', header: 'Location', sortable: true, action: true, width: '30' },
             { field: 'access', header: 'Access', sortable: true, action: true, width: '20' },
             { field: 'browser', header: 'Browser', sortable: true, action: false, width: '20' });
            this.visibleCols = ['scriptName', 'location', 'access', 'userid', 'sessionid', 'absstarttime', 'duration', 'status'];
        }
        else {
            // this.nsCommonData.isFromSummary = false;
            this.visibleCols = ['scriptName', 'userid', 'sessionid', 'starttime', 'duration', 'status'];
        }
        this.cols = this.cols.concat({ field: 'userid', header: 'User Id', sortable: 'custom', action: true, width: '15' },
            { field: 'sessionid', header: 'Session Id', sortable: 'custom', action: true, width: '15' },
            { field: 'starttime', header: 'Start Time', sortable: 'custom', action: true, width: '30' },
            { field: 'duration', header: 'Session Duration', sortable: 'custom', action: true, width: '30' },
            { field: 'status', header: 'Status', sortable: true, action: true, width: '30' });

        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
            this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
          }
        console.log('this.cols *** ', this.cols)
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

    getSessionInstanceData() {
        let ajaxParam='';
        if (!this.totalCount)
            this.showCount = true;
        else
            this.showCount = undefined;
        let url = '';
        if(this.commonService.enableQueryCaching == 1){
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionInstance?cacheId='+ this.id.testRun + '&testRun=' + this.id.testRun; 
        }
        else{
            url =  this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionInstance?testRun=' + this.id.testRun; 
        }
            
           if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsSessionInstance).length!=0) {
           
            if (this.nsCommonData.isFromSummary) {
                this.commonService.nsSessionInstance['scriptName']=this.nsCommonData.currRowData['scriptName'] ;
                this.commonService.nsSessionInstance['scriptidx'] =this.nsCommonData.currRowData['sessionIndex'];
                  }
          
            this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsSessionInstance;    
            ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsSessionInstance);
            ajaxParam += '&showCount=' + true;
            console.log("after filter applied==>",ajaxParam);
            // this._ddrData.startTime = this.commonService.nsSessionInstance['startTime'];
            // this._ddrData.endTime = this.commonService.nsSessionInstance['endTime']; commented for bug id:69498 
        }
       else
        {
         ajaxParam='&startTime=' + this.id.startTime + '&endTime=' + this.id.endTime;
            // alert('this.nsCommonData.isFromSummary '+this.nsCommonData.isFromSummary);
            this._ddrData.startTime = this.id.startTime;
            this._ddrData.endTime = this.id.endTime;

        // if(this._ddrData.groupName=="Session"  && this._ddrData.vectorName!='undefined'&& this._ddrData.vectorName!=undefined )
        // ajaxParam += '&script=' + this._ddrData.vectorName;
                
        if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        ajaxParam += '&groupName=' +this._ddrData.vectorName;
       if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        ajaxParam += '&generatorName=' +this._ddrData.generatorName;

               if (this._ddrData.fromReport) {
                   ajaxParam += '&nsErrorName=' + this._ddrData.errorNameSession;
               }
               else if (this._ddrData.nsErrorName) {
                   ajaxParam += '&nsErrorName=' + this._ddrData.nsErrorName;
               }

        if (this.nsCommonData.isFromSummary) {
      ajaxParam += '&wanEnv=' + this._ddrData.WAN_ENV +'&scriptName=' +  this.nsCommonData.currRowData['scriptName']  /* this.nsCommonData.scriptName */ + '&strStatus=' + this.nsCommonData.sessionIndex + '&scriptidx=' + this.nsCommonData.currRowData['sessionIndex'] ;
        }
        else
            ajaxParam += '&wanEnv='  + this._ddrData.WAN_ENV;
            console.log("ajaxParam=======>>>>>",ajaxParam);
        //this.commonService.nsSessionInstance=this.commonService.makeObjectFromUrlParam(ajaxParam);
        }
        if(this.commonService.isFromSessionSummary ||this.commonService.isFromSessionFailure)
        {
            console.log("is from summary to instance==>",this.commonService.nsSessionInstance);
            ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsSessionInstance,true);

            //setting value to key
        this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsSessionInstance;
        console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);
        }
        else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
            this.commonService.isFromSessionSummary =true ;
            this.commonService.isFromSessionFailure = true ;
            console.log("inside else cond===> ",this._ddrData.nsCQMFilter[this.commonService.currentReport])
            ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
          }
        this.commonService.nsSessionInstance=this.commonService.makeObjectFromUrlParam(ajaxParam); 
        url +=ajaxParam+ '&limit=' + this.limit + '&offset=' + this.offset + '&queryId='+this.queryId;
        console.log("Final URL===>",url);
        if(!url.includes("&showCount"))
        url+='&showCount=' + this.showCount;

        this.makeTableColumns();
        setTimeout(() => {
            this.openpopup();
           }, this._ddrData.guiCancelationTimeOut);
        this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignValues(data)));
    }	

    doAssignValues(res: any) {
        this.isCancelQuerydata = true;
        this.commonService.isFilterFromNSSideBar=false;
        console.log('Session summary Data ', res);
        if (res.hasOwnProperty('count')){
            this.totalCount = res.count;
            if (this.limit > this.totalCount)
                this.limit = Number(this.totalCount);
        }

        this.data = res.data;
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
        if (this.nsCommonData.isFromSummary)
            this.showfilterCriteria(res.strStartTime, res.strEndTime, res.data[0].status);
        else
            this.showfilterCriteria(res.strStartTime, res.strEndTime);
            this.commonService.customTimePlaceHolder=[];
            this.commonService.customTimePlaceHolder.push(res.strStartTime, res.strEndTime);
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


    paginate(event) {
        // event.first = Index of the first record  (used  as offset in query) 
        // event.rows = Number of rows to display in new page  (used as limit in query)
        // event.page = Index of the new page
        // event.pageCount = Total number of pages
        this.commonService.rowspaerpage = event.rows;
        this.offset = parseInt(event.first);
        this.limit = parseInt(event.rows);

        if (this.limit > this.totalCount)
            this.limit = Number(this.totalCount);

        if ((this.limit + this.offset) > this.totalCount)
            this.limit = Number(this.totalCount) - Number(this.offset);
            this.loader = true;
            this.getProgressBar();
        this.commonService.isFilterFromNSSideBar = true;
        this.getSessionInstanceData();
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
    makeUserId(nodeData) {
        return nodeData.childindex + ":" + nodeData.userid;
    }
    makeSessionIndex(nodeData) {
        return nodeData.childindex + ":" + nodeData.sessionid;
    }
    showfilterCriteria(startTime: any, endTime: any, status?: string) {
        this.filterCriteria = ""; 
        this.toolTipStatus='';
        this.toolTipUrl='';
        this.filterStatus='';
        this.filterUrl='';
        let sessionInstance=this.commonService.nsSessionInstance;
        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
            this.filterCriteria += "DC=" + this._ddrData.dcName;
        if (this.nsCommonData.isSuccess)
            this.filterCriteria += ', Session Status= ' + this.nsCommonData.isSuccess;
        if (!this.commonService.isValidParamInObj(sessionInstance, 'phaseName')) {
            if (startTime !== 'NA' && startTime !== '' && startTime !== undefined)
                this.filterCriteria += ', From=' + startTime;
            if (endTime !== 'NA' && endTime !== '' && endTime !== undefined)
                this.filterCriteria += ', To=' + endTime;
        }

        if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
        this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;

        if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;

        if (this.nsCommonData.isFromSummary)
            this.filterCriteria += ', Script= ' + this.nsCommonData.currRowData["scriptName"];

        if (this.commonService.isValidParamInObj(sessionInstance, 'script'))
            this.filterCriteria += ", script=" + sessionInstance.script;
        if (this.commonService.isValidParamInObj(sessionInstance, 'url'))
        { 
            let url=sessionInstance['url'];
            if(url && url.length>=20)
            {
              this.toolTipUrl+="Url= "+sessionInstance['url'];
              url=url.substring(0,19);
              this.filterUrl += ", url=" + url+" ....";
            }
            else
            this.filterUrl += ", url=" + url;
          }
        //this.filterCriteria += ", url=" + sessionInstance.url;
        if (this.commonService.isValidParamInObj(sessionInstance, 'transactionName'))
            this.filterCriteria += ", transactionName=" + sessionInstance.transactionName;
        if (this.commonService.isValidParamInObj(sessionInstance, 'page'))
            this.filterCriteria += ", page" + sessionInstance.page
        if (this.commonService.isValidParamInObj(sessionInstance, 'location'))
            this.filterCriteria += ", location=" + sessionInstance.location
        if (this.commonService.isValidParamInObj(sessionInstance, 'access'))
            this.filterCriteria += ", access=" + sessionInstance.access
        if (this.commonService.isValidParamInObj(sessionInstance, 'browser'))
            this.filterCriteria += ", browser=" + sessionInstance.browser
        if (this.commonService.isValidParamInObj(sessionInstance, 'group'))
            this.filterCriteria += ", group=" + sessionInstance.group
        if (this.commonService.isValidParamInObj(sessionInstance, 'order'))
            this.filterCriteria += ", order=" + sessionInstance.order
        if (this.commonService.isValidParamInObj(sessionInstance, 'strStatus'))
        {
            let status=sessionInstance['strStatus'];
            if(status && status.length>=20)
            {
              this.toolTipStatus+="Status= "+sessionInstance['strStatus'];
              status=status.substring(0,19);
              this.filterStatus += ", Status=" + status+" ....";
            }
            else
            this.filterStatus += ", Status=" + status;
           
        }
        if (this.commonService.isValidParamInObj(sessionInstance, 'phaseName'))
        this.filterCriteria += ", Phase Name=" + sessionInstance.phaseName;
        //   this.filterCriteria += ", Status=" + sessionInstance.strStatus
        if (this.filterCriteria.trim().startsWith(',')) {
            this.filterCriteria = this.filterCriteria.trim().substring(1);
        }
    }
    openSessionDetailReport(nodeData) {
        this.nsCommonData.currRowData = nodeData;
        this.nsCommonData.objectType = '3';
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_INSTANCE;
        this._router.navigate(['/home/ddr/nsreports/sessionTiming'])
    }
    openUserSessionReport(nodeData) {
        this.nsCommonData.currRowData = nodeData;
        this.nsCommonData.objectType = '3';
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_INSTANCE;
        if(this.commonService.isFromSessionFailure || this.commonService.isFromSessionSummary)
        {
           this.commonService.nsUserSession=JSON.parse(JSON.stringify(this.commonService.nsSessionInstance));
           console.log(" is going from session instance to user session==>",this.commonService.nsUserSession);
           this.commonService.isFromSessionInstance=true;
        }
        this._router.navigate(['/home/ddr/nsreports/userSession'])
    }
    openSessionName(nodeData) {
        let url = this.getHostUrl() + '/' + this.id.product +
            '/recorder/recorder.jsp?openFrom=TR' + this.id.testRun +
            '&scriptName=' + nodeData +"&sesLoginName=" + sessionStorage.getItem('sesLoginName');

        window.open(url, "_blank");
    }

    customsortOnColumns(event, tempData) {
        if (event["field"] == 'userid' || event["field"] == 'sessionid') {
            if (event.order == -1) {
                var temp = (event["field"]);
                let arr1: any[];
                let arr2: any[];
                event.order = 1
                tempData = tempData.sort(function (a, b) {
                    arr1 = (a['childindex']+":"+a[temp]).split(":");
                    arr2 = (b['childindex']+":"+b[temp]).split(":");
                    if (arr1[0] == arr2[0]) {
                        var value = Number(arr1[1]);
                        var value2 = Number(arr2[1]);
                    } else {
                        var value = Number(arr1[0]);
                        var value2 = Number(arr2[0]);
                    }
                    return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                });
            }
            else {
                var temp = (event["field"]);
                let arr1: any[];
                let arr2: any[];
                event.order = -1;
                //asecding order
                tempData = tempData.sort(function (a, b) {
                    arr1 = (a['childindex']+":"+a[temp]).split(":");
                    arr2 = (b['childindex']+":"+b[temp]).split(":");
                    if (arr1[0] == arr2[0]) {
                        var value = Number(arr1[1]);
                        var value2 = Number(arr2[1]);
                    } else {
                        var value = Number(arr1[0]);
                        var value2 = Number(arr2[0]);
                    }
                    return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                });
            }
        }
        else {
        if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1
            console.log('temp datattaaa ', temp);
            tempData = tempData.sort(function (a, b) {
                if (event["field"] == 'starttime' || event["field"] == 'duration') {
                    var value = Number(a[temp].replace(/[:.,]/g, ''));
                    var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                }
                else {
                    var value = Number(a[temp]);
                    var value2 = Number(b[temp]);
                }
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            var temp = (event["field"]);
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                if (event["field"] == 'starttime' || event["field"] == 'duration') {
                    var value = Number(a[temp].replace(/[:.,]/g, ''));
                    var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                }
                else {
                    var value = Number(a[temp]);
                    var value2 = Number(b[temp]);
                }
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }
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

    setTestRunInHeader(){
        if (this.id && this.id.product.toLowerCase() == 'netstorm') {
          this.strTitle = 'Netstorm - Session Instance Report - Test Run : ' + this.id.testRun;
        }
        else if(this.id && this.id.product.toLowerCase() == 'netcloud')
          this.strTitle = 'NetCloud - Session Instance Report - Test Run : ' + this.id.testRun;
         else {
          this.strTitle = 'Netdiagnostics Enterprise - Session Instance Report - Session : ' + this.id.testRun;
        }
      }
/** Download report for Instance report  */
downloadReports(reports: string) {
    let downloadInstanceInfo =JSON.parse(JSON.stringify(this.data));

    let renameArray = {'scriptName': 'Script Name', 'location': 'Location','access': 'Access','userid': 'User Id','sessionid': 'Session Id','starttime': 'Start Time','duration': 'Session Duration','status': 'Status'}
    let colOrder;
       if(this._ddrData.WAN_ENV > 0)     
       colOrder = ['Script Name','Location','Access','User Id','Session Id','Start Time','Session Duration','Status'];
       else
       colOrder = ['Script Name','User Id','Session Id','Start Time','Session Duration','Status'];
        // console.log("InstanceData=========== ", JSON.stringify(this.data));
   downloadInstanceInfo.forEach((val, index) => {

         val['userid']= (val['childindex']+":"+val['userid']);
         val['sessionid']= (val['childindex']+":"+val['sessionid']);
  
          val['starttime']= this.msToTimeFormate(val['starttime']);
          val['duration']= this.msToTimeFormate(val['duration']);
          delete val['browser'];
          delete val['childindex'];
          delete val['absstarttime']; 
          if(this._ddrData.WAN_ENV < 1)
          {
          delete val['location'];
          delete val['access'];
          }
        });
   // console.log("TransactionInstanceData=========== ", JSON.stringify(downloadInstanceInfo));
          let downloadObj: Object = {
          downloadType: reports,
          varFilterCriteria: this.filterCriteria,
          strSrcFileName: 'SessionInstance',
          strRptTitle: this.strTitle,
          renameArray: JSON.stringify(renameArray),
          colOrder: colOrder.toString(),
          jsonData: JSON.stringify(downloadInstanceInfo)
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
          this.commonService.isFromSessionFailure=false;
          this.commonService.isFromSessionSummary=false;
          this.nsCommonData.isFromSummary=false;
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
