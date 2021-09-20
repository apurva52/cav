import { Component } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { NsCommonService } from '../../services/ns-common-service';
import { SelectItem, SessionTimingInterface } from '../interfaces/ns-session-info';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'session-timing-detail',
    templateUrl: 'session-timing-detail.component.html',
    styleUrls: ['session-timing-detail.component.scss']
})
export class SessionTimingDetailComponent {
    ndKeyValue: boolean;
 pdKeyValue: boolean;
    cols1: any;
    id: any;
    visibleCols1: any[];
    columnOptions1: SelectItem[];
    tableData: Array<SessionTimingInterface>;
    options: Object;
    chartData: any;
    scaleData:any;
    startTime:string;
    scriptName:string;
    respTime:any;
    status;
    totalBytes:string;
    reportType:string;
    filterCriteria:string="";
    loading = false;
    strTitle: any;
    
    /**
     * url Param 
     */
    strTime:string;
    childIndex :string;
    sessionIndex:string;
    urlidx:string;
    pageinst:string;
    trxnInstance:string;

    /**
     * Use for Filter Criteria
     */
    sessWithUserID:string;
    location:string;
    access:string;
    pageName:string;
    browser: string;
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;

    constructor(public commonService: CommonServices, 
        private _navService: CavTopPanelNavigationService, private _router: Router, 
        private _cavConfigService: CavConfigService,private breadcumb : DdrBreadcrumbService,
        private nsCommonData: NsCommonService,private ddrData:DdrDataModelService,
        private ddrRequest:DDRRequestService) {

    }
    ngOnInit() {
        this.loading = true;
        this.randomNumber();
        this.getDataFromRow();
        this.id = this.commonService.getData();
        this.commonService.isToLoadSideBar=false;
        this.getSessionTimingDetailData();
        this.makeTableColumns();
        this.setTestRunInHeader();
    }

    /*Method is used get host url*/
    getHostUrl(isDownloadCase?): string {
        var hostDcName = this.ddrData.getHostUrl();
        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
            this.id.testRun = this.ddrData.testRun;
            console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
        }
        console.log('hostDcName getHostURL =', hostDcName);
        return hostDcName;
    }

    getSessionTimingDetailData() {
        let url = '';
        if(this.commonService.enableQueryCaching == 1){
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionTime?cacheId='+ this.id.testRun + '&testRun=' + this.id.testRun;
        }
        else{
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionTime?testRun=' + this.id.testRun;
        }
        // query doesnt support start time and end time . #only start time in case of url.
        url += '&childidx=' + this.childIndex + 
            '&objectType='+this.nsCommonData.objectType +
            '&sessioninst=' + this.sessionIndex + 
            '&txinst=' + this.trxnInstance +
            '&starttime='+ this.strTime +
            '&urlidx='+ this.urlidx +
            '&strStartTime='+this.id.startTime +
            '&strEndTime='+this.id.endTime +
            '&pageInstance='+this.pageinst+
            '&queryId='+this.queryId;

        if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
            url += '&generatorName=' +this.ddrData.generatorName;

            setTimeout(() => {
                this.openpopup();
               }, this.ddrData.guiCancelationTimeOut);

            this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doGetTableValues(data)));
    }
    doGetTableValues(res: any) {
        this.isCancelQuerydata =true;
        if(!res.tableData){
            this.loading = false;
            return;
        }
        else{
            setTimeout(() => {
                this.loading = false;
            }, 1000);
        }
        this.tableData = res.tableData;
        this.chartData = res.barData;
        this.scaleData = res.scaleData;
        this.totalBytes = res.totalBytes;
        this.ndKeyValue = res.ndKeyValue;
         this.pdKeyValue = res.pdKeyValue;
        this.showfilterCriteria(res.strStartTime,res.strEndTime);
        

    }
    showToolTip(text,obj,val){
        let tooltip =  text + '\n' + obj + '\n' +val; //&#013;
        return tooltip;
    }
    strinToNum(rowdata) {
        return Number.parseFloat(rowdata);
    }
    truncateUrl(urlName, limit) {
        if (urlName.indexOf('?') != -1)
            urlName = urlName.substring(0, urlName.indexOf('?')) + "...";
        // Check for : from index 6 to skip http: or https:
        else if (urlName.indexOf(':', 6) != -1)
            urlName = urlName.substring(0, urlName.indexOf(':', 6)) + "...";

        if (urlName.length > limit)
            urlName = urlName.substring(0, limit) + "...";
        return urlName;
    }

    makeTableColumns() {
        this.cols1 = [
            { field: 'objName', header: 'Object Name', sortable: true, action: true, width: 10,align:'left' },
            { field: 'status', header: 'Status', sortable: true, action: true, width: 4 ,align:'left' },
            { field: 'httpCode', header: 'HTTP Code', sortable: true, action: true, width: 3,align:'right'  },
            { field: 'connReused', header: 'Reused Conn.', sortable: true, action: true, width: 2.5,align:'left'  },
            { field: 'sslReused', header: 'Reused SSL', sortable: true, action: true, width: 2.5 ,align:'left' },
            { field: 'startTime', header: 'Start Time', sortable: 'custom', action: true, width: 5 ,align:'right' },
            { field: 'totalTime', header: 'Total', sortable: 'custom', action: false, width: 4 ,align:'right' },
            { field: 'dnsLookup', header: 'DNS', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'connectTime', header: 'Connect', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'sslTime', header: 'SSL', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'reqTime', header: 'Request', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'firstByte', header: '1st Byte', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'contentDownload', header: 'Content Download', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'totalBytes', header: 'Total bytes', sortable: 'custom', action: false, width: 5 ,align:'right'},
            { field: 'action', header: 'Action', sortable: false, action: false, width: 5, align:'center'},


        ];
        this.visibleCols1 = ['objectName', 'status', 'httpCode', 'connReused', 'sslReused', 'startTime', 'totalTime', 'connectTime', 'sslTime', 'reqTime', 'firstByte', 'contentDownload,', 'totalBytes', 'action'];
        this.columnOptions1 = [];
        for (let i = 0; i < this.cols1.length; i++) {
            this.columnOptions1.push({ label: this.cols1[i].header, value: this.cols1[i].field });
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

    getDataFromRow()
    {
        if(!this.nsCommonData.objectType)
          this.nsCommonData.objectType = sessionStorage.getItem("objType");
        else
          {
              sessionStorage.removeItem("objType");
              sessionStorage.setItem("objType",this.nsCommonData.objectType);
          }
        if(!this.nsCommonData.currRowData)
            this.nsCommonData.currRowData = JSON.parse(sessionStorage.getItem("currRowData"));
        else
          {
            sessionStorage.removeItem("currRowData");
            sessionStorage.setItem("currRowData",JSON.stringify(this.nsCommonData.currRowData));
          }

          
        if(this.nsCommonData.objectType === '2') //transaction
        {
            this.reportType = 'Transaction';
            this.startTime = this.nsCommonData.currRowData["startTime"];
            this.respTime = this.nsCommonData.currRowData["responseTime"]/1000;
            this.childIndex = this.nsCommonData.currRowData["childIndex"];
            this.trxnInstance = this.nsCommonData.currRowData["txInstance"];
            this.sessionIndex = this.nsCommonData.currRowData["sessionInst"];
            this.status = this.nsCommonData.currRowData["statusName"];
            this.scriptName = this.nsCommonData.currRowData["scriptName"];
            /**Use For Filtercriteria */
            this.sessWithUserID = this.nsCommonData.currRowData["userId"];
            this.pageName = this.nsCommonData.currRowData["TransactionName"];
            if(this.nsCommonData.currRowData["location"] && this.nsCommonData.currRowData["access"] && this.nsCommonData.currRowData["browser"]){
                this.location = this.nsCommonData.currRowData["location"];
                this.access = this.nsCommonData.currRowData["access"];
                this.browser = this.nsCommonData.currRowData["browser"];
            }
        }
        else if(this.nsCommonData.objectType === '1') //page 
        {          
            this.reportType = 'Page';
            this.status = this.nsCommonData.currRowData["status"];
	    this.scriptName = this.nsCommonData.currRowData["scriptName"];
            this.startTime = this.nsCommonData.currRowData["startTime"];
            this.respTime = this.nsCommonData.currRowData["respTime"]/1000;
            this.childIndex = this.nsCommonData.currRowData["childIndex"];
            let sessId = this.nsCommonData.currRowData["sessionId"];
            this.sessionIndex = sessId.substring(sessId.indexOf(':')+1,sessId.length);
            this.pageinst = this.nsCommonData.currRowData["pageInstance"];
            /** For Filter Criteria */
            this.sessWithUserID = this.nsCommonData.currRowData["userId"];
            this.pageName = this.nsCommonData.currRowData["pageName"];
            if(this.nsCommonData.currRowData["location"] && this.nsCommonData.currRowData["access"] && this.nsCommonData.currRowData["browser"]){
                this.location = this.nsCommonData.currRowData["location"];
                this.access = this.nsCommonData.currRowData["access"];
                this.browser = this.nsCommonData.currRowData["browser"];
            }
        }
        else if(this.nsCommonData.objectType === '0') //url
        {
            this.reportType = 'Url';
            this.status = this.nsCommonData.currRowData["statusName"];
            this.startTime = this.nsCommonData.currRowData["startTime"];
            this.childIndex =this.nsCommonData.currRowData["childIndex"];
            this.sessionIndex = this.nsCommonData.currRowData["sessionId"];
            this.urlidx = this.nsCommonData.currRowData["urlIndex"];
            this.pageinst = this.nsCommonData.currRowData["pageInstance"];
            this.strTime = this.nsCommonData.currRowData["startTime"];
            this.scriptName = this.nsCommonData.currRowData["scriptName"];
            this.respTime = this.nsCommonData.currRowData["responseTime"]/1000;
            /** For Filter Criteria */
            this.sessWithUserID = this.nsCommonData.currRowData["convuserId"];
            this.pageName = this.nsCommonData.currRowData["pageName"];
            if(this.nsCommonData.currRowData["location"] && this.nsCommonData.currRowData["access"] && this.nsCommonData.currRowData["browser"]){
                this.location = this.nsCommonData.currRowData["location"];
                this.access = this.nsCommonData.currRowData["access"];
                this.browser = this.nsCommonData.currRowData["browser"];
            }
        }
        else if(this.nsCommonData.objectType === '3') //Session
        {
            this.reportType = 'Session';
            this.scriptName = this.nsCommonData.currRowData["scriptName"];
            this.startTime = this.nsCommonData.currRowData["starttime"];
            this.respTime = this.nsCommonData.currRowData["duration"]/1000;
            this.status = this.nsCommonData.currRowData["status"];

            if (!this.respTime)                 // coming from ns-usersession 
                this.respTime = this.nsCommonData.currRowData["totalTime"] / 1000;
            if (!isNaN(this.status))                   // coming from ns-usersession 
                this.status = this.nsCommonData.currRowData["statusName"];
            
            
            if (this.nsCommonData.currRowData["childindex"])                    // Child index From  Session Instance
                this.childIndex = this.nsCommonData.currRowData["childindex"];
            else if (this.nsCommonData.currRowData["childIndex"])               // Child Index From ns-usersession report
                this.childIndex = this.nsCommonData.currRowData["childIndex"];

             if (this.nsCommonData.currRowData["starttime"])                    // start timeFrom  Session Instance
                this.startTime = this.nsCommonData.currRowData["starttime"];
             else if (this.nsCommonData.currRowData["startTime"])               // start Time From ns-usersession report
                this.startTime = this.nsCommonData.currRowData["startTime"];

            if (this.nsCommonData.currRowData["sessionid"])                     // Session id From  Session Instance
                this.sessionIndex = this.nsCommonData.currRowData["sessionid"];
            else if (this.nsCommonData.currRowData["sessionId"])                // Session Id From ns-usersession report
                this.sessionIndex = this.nsCommonData.currRowData["sessionId"];
            /** For Filter Criteria */
            if (this.nsCommonData.currRowData["userid"])
                this.sessWithUserID = this.childIndex + ":" + this.nsCommonData.currRowData["userid"];
            else
                this.sessWithUserID = this.childIndex + ":" + this.nsCommonData.userId;   //comes from user-session
            if(this.nsCommonData.currRowData["location"] && this.nsCommonData.currRowData["access"] && this.nsCommonData.currRowData["browser"]){
                    this.location = this.nsCommonData.currRowData["location"];
                    this.access = this.nsCommonData.currRowData["access"];
                    this.browser = this.nsCommonData.currRowData["browser"];
            }
        }
    }

    customsortOnColumns(event, tempData)
     {
            if (event.order == -1) {
                var temp = (event["field"]);
                event.order = 1
                console.log('temp datattaaa ', temp);
                tempData = tempData.sort(function (a, b) {
                    if (temp == 'startTime' || temp == 'totalBytes') // for start Time -- 00:23:19.131"
                    {
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
                    if (temp == 'startTime'|| temp == 'totalBytes') {
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
        this.tableData = [];
        //console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.tableData = this.Immutablepush(this.tableData, rowdata) });
        }

    }
    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }


    convertIntoNumber(data) {
        return Number(data);
    }
    openFlowpathReport(rowdata) {
        console.log('currrow fpid ', rowdata);
	this.commonService.isFilterFromSideBar = false;
	this.ddrData.resetDDRArguments();
        this.ddrData.fpIdFromNSSession = rowdata.flowpath;
        console.log(' *** *** *** *** *** ** ***** ****  ***************= ', this.commonService.flowpathInstance);
        this.breadcumb.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_TIMING;
        this._router.navigate(['/home/ddr/flowpath']);
    }
    showfilterCriteria(startTime: any, endTime: any) {
        
	if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
            this.filterCriteria += "DC=" + this.ddrData.dcName;
        if (startTime)
            this.filterCriteria += ', From=' + startTime;
        if (endTime)
            this.filterCriteria += ', To=' + endTime;
        if(this.ddrData.WAN_ENV)       
        {
        if (this.location)
            this.filterCriteria += ", Location= " + this.location;
        if (this.access)
            this.filterCriteria += ", Access= " + this.access;
        if (this.browser)
            this.filterCriteria += ", Browser= " + this.browser;
        }
        if (this.pageName) {
            if (this.reportType == 'Transaction')
                this.filterCriteria += ", Transaction= " + this.pageName;
            else
                this.filterCriteria += ", Page= " + this.pageName;
        }
        if (this.scriptName)
            this.filterCriteria += ", Script= " + this.scriptName;
        if (this.sessWithUserID)
            this.filterCriteria += ", User Id= " + this.sessWithUserID;
            
        if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
        this.filterCriteria += ', Generator Name=' +this.ddrData.generatorName;    

        if (this.filterCriteria.startsWith(','))
            this.filterCriteria = this.filterCriteria.substring(1);
    }

    setTestRunInHeader(){
        if (this.id && this.id.product.toLowerCase() == 'netstorm') {
          this.strTitle = 'Netstorm - '+this.reportType+' Timing Details - Test Run : ' + this.id.testRun;
        }
        else if(this.id && this.id.product.toLowerCase() == 'netcloud') 
          this.strTitle = 'NetCloud - '+this.reportType+' Timing Details - Test Run : ' + this.id.testRun;
        else {
          this.strTitle = 'Netdiagnostics Enterprise - '+this.reportType+' Timing Details - Session : ' + this.id.testRun;
        }
      }
      
      ViewPageDump(row){
        try {
            console.log("row in page dumppp",row);
            let endtm;
            if (this.startTime && this.respTime)
                endtm = Number(this.startTime) + Number(this.respTime*1000);
                let urlPar = {};
                urlPar['path'] =  this.getHostUrl();
                urlPar['product'] = this.id.product;
                urlPar['testRun'] = this.id.testRun;
                urlPar['userName'] = this.id.userName || "";
                urlPar['strOperName'] = 'pageDump';
		urlPar['strScriptName'] = this.scriptName;
                urlPar['sessionIndex'] = this.sessionIndex;
                urlPar['childIndex'] = this.childIndex;
                urlPar['pageName'] = row.pageName;
                urlPar['flagOfDrillDown'] = 'yes';

            // let url = '//' + this.getHostUrl() + '/' + this.id.product + '/analyze/rptPageDumpFramesNew.jsp?testRun=' + this.id.testRun + '&strOperName=pageDump' + '&sessionIndex=' + this.sessionIndex + '&childIndex=' + this.childIndex + '&pageName=' + row.pageName + "&flagOfDrillDown=yes";
            if(!(row.flowpath >0))
            {
                urlPar['isND'] = 0;
                urlPar['StartTime'] = this.startTime;
                urlPar['EndTime'] = endtm;
                urlPar['flowPathInstance'] = "0";
            //   url += '&isND=0' + '&StartTime=' + this.startTime  + '&EndTime=' + endtm;
            }
            else
            {
                urlPar['flowPathInstance'] = row.flowpath;
                urlPar['pageName'] = row.pageName;
                urlPar['StartTime'] = this.startTime;
                urlPar['strStartTime'] = this.id.startTime;
                urlPar['strEndTime'] = this.id.endTime;
                urlPar['EndTime'] = endtm;
            //  url +=  '&flowPathInstance=' + row.flowpath +'&StartTime=' +this.startTime + '&strStartTime=' + this.id.startTime+ '&strEndTime='+this.id.endTime+"&EndTime=" + endtm;
            }
            this.ddrData.pagedump = urlPar;
            // this.breadcumb.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_INSTANCE;
            this._navService.addNewNaviationLink('ddr');
            sessionStorage.setItem("ddrTabName","Page Dump");
            // this.ddrData.tabNameObserver$.next('');
            this.breadcumb.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_TIMING;
            this._router.navigate(['/home/ddr/pagedump']);
            // window.open(url,'_blank');
            }
        catch (error) {
            console.log(error);
        }

      }
    /*  ViewPageDump(row){
        try {
            console.log("row in page dumppp",row);
            let endtm;
            if (this.startTime && this.respTime)
                endtm = Number(this.startTime) + Number(this.respTime*1000);
            let url = '//' + this.getHostUrl() + '/' + this.id.product + '/analyze/rptPageDumpFramesNew.jsp?testRun=' + this.id.testRun + '&strOperName=pageDump' + '&sessionIndex=' + this.sessionIndex + '&childIndex=' + this.childIndex + '&pageName=' + row.pageName + "&flagOfDrillDown=yes";
            if(!(row.flowpath >0))
            {
              url += '&isND=0' + '&StartTime=' + this.startTime  + '&EndTime=' + endtm;
            }
            else
            {
             url +=  '&flowPathInstance=' + row.flowpath +'&StartTime=' +this.startTime + '&strStartTime=' + this.id.startTime+ '&strEndTime='+this.id.endTime+"&EndTime=" + endtm;
            }
            window.open(url,'_blank');
            }
        catch (error) {
            console.log(error);
        }

      }*/

/** Download report for Instance report  */
downloadReports(reports: string) {
    let downloadTimingInfo =JSON.parse(JSON.stringify(this.tableData));
    let renameArray = {'objName': 'Object Name', 'status': 'Status','httpCode': 'HTTP Code','connReused': 'Reused Conn.','sslReused': 'Reused SSL','startTime': 'Start Time','totalTime': 'Total','dnsLookup': 'DNS','connectTime': 'Connect', 'sslTime': 'SSL','reqTime': 'Request','firstByte': '1st Byte', 'contentDownload': 'Content Download','totalBytes': 'Total bytes'}
            
    let colOrder = ['Object Name','Status','HTTP Code','Reused Conn.','Reused SSL','Start Time','Total','DNS','Connect',  'SSL','Request','1st Byte',  'Content Download','Total bytes'];
 //console.log("InstanceData=========== ", JSON.stringify(this.tableData));
 downloadTimingInfo.forEach((val, index) => {

        delete val['action'];
        delete val['flowpath'];
        delete val['fpSignature']; 
        delete val['instance'];
        delete val['object']; 
	delete val['pageName'];
            });
   // console.log("tableData=========== ", JSON.stringify(downloadTimingInfo));
          let downloadObj: Object = {
          downloadType: reports,
          varFilterCriteria: this.filterCriteria,
          strSrcFileName: 'NSTimingDetails',
          strRptTitle: this.strTitle,
          renameArray: JSON.stringify(renameArray),
          colOrder: colOrder.toString(),
          jsonData: JSON.stringify(downloadTimingInfo)
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
        window.open(decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
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
      }, this.ddrData.guiCancelationTimeOut);
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
