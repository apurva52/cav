import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { SessionFailureInterface } from '../interfaces/ns-session-info';
import { AccordionModule } from 'primeng/primeng';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { NsCommonService } from '../../services/ns-common-service';
import { SelectItem } from '../../../../interfaces/selectitem';
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
    selector: 'session-failure-report',
    templateUrl: 'session-failure-report.component.html',
    styleUrls: ['session-failure-report.component.scss']
})
export class SessionFailureReportComponent {
    toolTipStatus: string;
    failureFilter: string;
    id: any;
    data: Array<SessionFailureInterface>;
    chartData: Object[];
    options: Object;
    filterCriteria="";
    loading = false;
    strTitle:any;
    visibleCols: any[];
    columnOptions:SelectItem[];
    cols: any;
    totalFailure:any;
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;
    
    constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
        private _router: Router, private _cavConfigService: CavConfigService,private nsCommonData:NsCommonService,
        private breadcrumbService: DdrBreadcrumbService, private ddrData:DdrDataModelService,private _ddrData: DdrDataModelService,
        private ddrRequest:DDRRequestService) {

    }
    ngOnInit() {
        this.loading = true;
        this.id = this.commonService.getData();
        this.commonService.currentReport='Session Failure';
        this.randomNumber();
        this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
        console.log("this.commonservice.nssessionFailure==>",this.commonService.nsSessionFailure); 
      
        this.fillFailureData();
        
    }

    fillFailureData(){
        try {
            this.getSessionFailureData();
            this.setTestRunInHeader();
        this.cols = [
          { field: 'status', header: 'Failure Type',  sortable: 'true',action: true, align: 'left'},
          { field: 'numberOfFailure', header: 'Number Of Failures', sortable:'true', action: true, align: 'right'},
  
        ];
  
        this.visibleCols = [
          'status','numberOfFailure'
        ];
  
        this.columnOptions = [];
        for (let i = 0; i < this.cols.length; i++) {
          this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
        }
        console.log('column options', this.columnOptions);
      } catch (error) {
        console.log('error in intialization compaonent --> ', error);
      }
    }
  

    getSessionFailureData() {
        if (!this.nsCommonData.currRowData)
            this.nsCommonData.currRowData = JSON.parse(sessionStorage.getItem("currRowData"));
        if (!this.nsCommonData.failureType)
            this.nsCommonData.failureType = sessionStorage.getItem("failureType");
        let url = '';
        let ajaxparam='';
        if(this.commonService.enableQueryCaching == 1){
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionFailure?cacheId='+ this.id.testRun + '&testRun=' + this.id.testRun;
        }
        else{
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionFailure?testRun=' + this.id.testRun;
        }
        
        ajaxparam +=  '&startTime=' + this.id.startTime + '&endTime=' + this.id.endTime +
            '&objectType=3&status=-1&scriptName=' + this.nsCommonData.currRowData["scriptName"] +
            '&objectId=' + this.nsCommonData.failureType;

        if (this._ddrData.nsErrorName){
	     ajaxparam +='&nsErrorName=' + this._ddrData.nsErrorName;
        }

        if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        ajaxparam += '&groupName=' +this._ddrData.vectorName;
        if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        ajaxparam += '&generatorName=' +this._ddrData.generatorName;
         if(this.commonService.isFromSessionSummary)
         {
             console.log("is from session summary to failure===>",this.commonService.nsSessionFailure);
             ajaxparam=this.commonService.makeParamStringFromObj(this.commonService.nsSessionFailure,true);

             //setting value to key
        this._ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsSessionFailure;
        console.log("this._ddrData.nsCQMFilter in data call==>",this._ddrData.nsCQMFilter);

         }
         else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
             this.commonService.isFromSessionSummary = true;
             console.log("inside else cond===> ", this._ddrData.nsCQMFilter[this.commonService.currentReport])
             ajaxparam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true);
         }
         url+=ajaxparam;
         console.log("FINAL URL ==>",url);
            sessionStorage.removeItem("failureType");
            sessionStorage.removeItem("currRowData");
            sessionStorage.setItem("currRowData",JSON.stringify(this.nsCommonData.currRowData));
            sessionStorage.setItem("failureType",this.nsCommonData.failureType);
            url+= '&queryId='+this.queryId;
            setTimeout(() => {
                this.openpopup();
               }, this._ddrData.guiCancelationTimeOut);
        this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignValues(data)));
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

    doAssignValues(res: any) {
        console.log('Session summary Data ', res);
        this.isCancelQuerydata = true;
        this.data = res.data;
        this.createStackedChart(this.data);
        setTimeout(()=>{
            this.loading = false;
        },2000);
        this.totalFailure= this.nsCommonData.currRowData.fail;
        this.showfilterCriteria(res.starStartTime,res.strEndTime);
    }
    showfilterCriteria(startTime: any, endTime: any, status?: string) {
        this.filterCriteria = "";
        this.failureFilter = "";
        this.toolTipStatus = "";

        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
            this.filterCriteria += "DC=" + this._ddrData.dcName + ',';
        }
        //    this.filterCriteria += ' Session Status= All Failures';
        
        if (this.commonService.nsSessionFailure && this.commonService.nsSessionFailure['statusName']) {

            let status = this.commonService.nsSessionFailure['statusName'];
            if (status && status.length >= 20) {
                this.toolTipStatus = status;
                status = status.substring(0, 19);
                this.failureFilter += ", Session Status=" + status + " ....";
            }
            else
                this.failureFilter += ', Session Status=' + status;
        }
        else if (this._ddrData.nsErrorName) {
            this.failureFilter += ' Session Status= ' + this._ddrData.nsErrorName;
        }
        else {
            this.failureFilter += ' Session Status= All Failures';
        }
        if (startTime !== 'NA' && startTime !== '' && startTime !== undefined)
            this.filterCriteria += ', From=' + startTime;
        if (endTime !== 'NA' && endTime !== '' && endTime !== undefined)
            this.filterCriteria += ', To=' + endTime;
            
        if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
            this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
        if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
            this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;    


        if (this.filterCriteria.startsWith(',')) {
            this.filterCriteria = this.filterCriteria.substring(1);
        }
    }
    createStackedChart(res: any) {
        this.chartData = res;
        var errArr = [];
        // alert(this.chartData);
        for (let i = 0; i < this.chartData.length; i++) {
            console.log(this.chartData[i]["failureType"])
            var errName = this.chartData[i]["status"];
            errArr.push({ "name": errName, "data": [Number(this.chartData[i]["numberOfFailure"])] })
        }
        console.log('this.errArr******* ', errArr)

        this.options = {
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Failure Detail Report For Session'
            },
            xAxis: {
                categories: ['Number of Failures']
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Failures'
                },
                stackLabels: {
                    enabled: true
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    pointWidth: 50
                }
            },
            series: errArr
        }
    }

    openInstanceReport(nodeData: any, flag?) {
        this.nsCommonData.isFromSummary=true;
        this._ddrData.nsCQMFilter["Session Instance"]=undefined;
        // console.log("nodeData>>>>>>>-------"+JSON.stringify(nodeData));
        this.nsCommonData.scriptName = this.nsCommonData.currRowData["scriptName"];
        if(flag== 'totalCount')
        this.nsCommonData.sessionIndex = '-1';
        else
        this.nsCommonData.sessionIndex = nodeData.failureType; 
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_FAILURE;
        console.log("node data in failure==>",nodeData);            
        //failure type is actualy error code.

        if(this.commonService.isFromSessionSummary)
        {   
            console.log("session failure obj==>",this.commonService.nsSessionFailure);
            this.commonService.nsSessionInstance = JSON.parse(JSON.stringify(this.commonService.nsSessionFailure));
            this.commonService.nsSessionInstance['wanEnv'] ='NA';
            if (this.commonService.nsSessionInstance['script']) {
                this.commonService.nsSessionInstance['scriptName'] = this.commonService.nsSessionInstance['script'];
                if (!this.commonService.nsSessionInstance.scriptName)   //incase no filter for script has been provided.
                {
                    this.commonService.nsSessionInstance['scriptName'] = this.nsCommonData.scriptName;
                    this.commonService.nsSessionInstance['scriptidx'] = this.nsCommonData.currRowData['sessionIndex'];
                }
            } 
              this.commonService.nsSessionInstance['strStatus']= nodeData.failureType;
              delete this.commonService.nsSessionInstance['status'];
              delete this.commonService.nsSessionInstance['objectType'];
              delete this.commonService.nsSessionInstance['strGroupBy'];
              
          this.commonService.isFromSessionFailure=true;
          console.log("going out of failure to instance==>",this.commonService.nsSessionInstance);
        }
        this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Session Instance');     
      
        this._router.navigate(["/home/ddr/nsreports/sessionInstance"]);
    }
   
    setTestRunInHeader(){
        if (this.id && this.id.product.toLowerCase() == 'netstorm') {
          this.strTitle = 'Netstorm - Session Failure Report - Test Run : ' + this.id.testRun;
        }
        else if(this.id && this.id.product.toLowerCase() == 'netcloud') 
          this.strTitle = 'NetCloud - Session Failure Report - Test Run : ' + this.id.testRun;
        else {
          this.strTitle = 'Netdiagnostics Enterprise - Session Failure Report - Session : ' + this.id.testRun;
        }
      } 

/** Download report for Failure report  */
downloadReports(reports: string) {
    let downloadfailureInfo =JSON.parse(JSON.stringify(this.data));
    let renameArray = {'status': 'Failure Type','numberOfFailure': 'Number Of Failures'}
            
    let colOrder = ['Failure Type','Number Of Failures'];
 //  console.log("Session  data=========== ", JSON.stringify(this.data));
   downloadfailureInfo.forEach((val, index) => {
          delete val['failureType'];
          delete val['scriptName'];  
              });
          let downloadObj: Object = {
          downloadType: reports,
          varFilterCriteria: this.filterCriteria,
          strSrcFileName: 'SessionFailure',
          strRptTitle: this.strTitle,
          renameArray: JSON.stringify(renameArray),
          colOrder: colOrder.toString(),
          jsonData: JSON.stringify(downloadfailureInfo)
        };
        let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product) +
            '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
        if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl,(downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
        else
            this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
                (this.openDownloadReports(res)));
    }

      openDownloadReports(res) {
        console.log('file name generate ===', res);
        window.open( decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
      }
    ngOnDestroy(): void {
        this.commonService.isFromSessionSummary = false;
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
