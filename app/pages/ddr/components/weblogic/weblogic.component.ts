import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {Observable} from 'rxjs';
//import {DataTableModule,BlockUIModule,PaginatorModule} from 'primeng/primeng';
import {CommonServices} from '../../services/common.services';
import { WeblogicDataInterface } from '../../interfaces/weblogic-data-info';
//import 'rxjs/Rx';
//import { ChartModule } from 'angular2-highcharts';
//import { CavConfigService } from "../../../../main/services/cav-config.service";
//import { CavTopPanelNavigationService } from "../../../../main/services/cav-top-panel-navigation.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
//import { DdrDataModelService } from '../../services/ddr-data-model.service';
import { DdrDataModelService } from '../../../../pages/tools/actions/dumps/service/ddr-data-model.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';

@Component({

    selector: 'weblogic',
    templateUrl: 'weblogic.component.html',
    styleUrls: ['weblogic.component.scss']
})
export class WeblogicComponent implements OnInit {
  highcharts = Highcharts;
  weblogicDetail:WeblogicDataInterface[]=[{threadName:"",workManager:"",currReq:"",totalReq:"",threadState:""}];
    threadInfoDetail:Object[];
    weblogicDataInfo:Array<WeblogicDataInterface>;
    originalAllData:Array<WeblogicDataInterface>;
    id:any; //For common service object access
    startTime:string="";
    endTime:string="";
    filterCriteria:string=""; //To show filter criteria
    options:Object; // Use for pie charts
    showPieChart:boolean=false; 
    loading: boolean = false; //Loading ajax loader icon
    showDownLoadReportIcon:boolean= true;
    strTitle:any; //To show title in download report

    totalThreads:string= ""; //Total no. of threads
    activeThreads:string= ""; //Total no. of active threads
    selectedThreadState:string="Thread State:All";
    showResetBtn:boolean=false;
    reportHeader:string="";

    selectedDC;
    filterDCName = '';
    
    ngOnInit(): void {
      this.loading = true;
       this.commonService.isToLoadSideBar = false ;
	  this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.WEBLOGIC);
      this.reportHeader = 'Weblogic Thread Pool Report- '+ this.id.testRun;
    }

    constructor(private commonService: CommonServices,
      //private _cavConfigService: CavConfigService, 
      //private _navService: CavTopPanelNavigationService, 
      //private _cavConfig: CavConfigService,
      private breadcrumbService :DdrBreadcrumbService, 
      private _ddrData: DdrDataModelService,
      private ddrRequest:DDRRequestService) {
      this.id = commonService.getData();
      this.getWeblogicData();
      this.setTestRunInHeader();
    }

    /*Method is used get host url*/
    getHostUrl(isDownloadCase?): string {
      var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if ( !isDownloadCase && sessionStorage.getItem("isMultiDCMode") == "true") {
        //hostDcName =   this._ddrData.host + ':' + this._ddrData.port;
        this.id.testRun = this._ddrData.testRun;
        //this.testRun= this._ddrData.testRun;
        console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
      }
      // else
      // if (this._navService.getDCNameForScreen("weblogic") === undefined)
      //   hostDcName = this._cavConfigService.getINSPrefix();
      // else
      //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("weblogic");

      // if (hostDcName.length > 0) {
      //   sessionStorage.removeItem("hostDcName");
      //   sessionStorage.setItem("hostDcName", hostDcName);
      // }
      // else
      //   hostDcName = sessionStorage.getItem("hostDcName");

      console.log('hostDcName =', hostDcName);
      return hostDcName;
    }
    /**
     * Rest call for getting weblogic data
     */
    getWeblogicData()
    {
      let url ='';
      this.loading = false;
     //if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL'){
      if(this.commonService.enableQueryCaching == 1){
       url = this.getHostUrl() + '/' + this.id.product+"/v1/cavisson/netdiagnostics/ddr/weblogicReport?cacheId="+ this.id.testRun + "&testRun=" + this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+ this.id.startTime + "&strEndTime="+ this.id.endTime;
      }
      else{
        url = this.getHostUrl() + '/' + this.id.product+"/v1/cavisson/netdiagnostics/ddr/weblogicReport?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+ this.id.startTime + "&strEndTime="+ this.id.endTime;
      }
    // }
    //  else{
    //   if(this.commonService.enableQueryCaching == 1){
    //      url = this.getHostUrl() + '/' + this.id.product+"/v1/cavisson/netdiagnostics/ddr/weblogicReport/" + this.id.testRun + "?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+ this.id.startTime + "&strEndTime="+ this.id.endTime;
    //   }
    //   else{
    //      url = this.getHostUrl() + '/' + this.id.product+"/v1/cavisson/netdiagnostics/ddr/weblogicReport?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+ this.id.startTime + "&strEndTime="+ this.id.endTime;
    //   }
    //  }

      return this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.doAssignWeblogicValue(data)));
    }

   /**
    *Assign values from JSON to local object array 
    * @param res 
    */
    doAssignWeblogicValue(res: any)
    {
      this.loading = false;
      this.createFilterCriteria();
      this.weblogicDetail = res.data; //JSON Weblogic data
      this.threadInfoDetail = res.threadInfo;
      this.weblogicDataInfo = this.getWeblogicDataInfo();
      this.originalAllData = this.weblogicDataInfo;
      if(this.weblogicDataInfo.length == 0 )
       this.showDownLoadReportIcon = false;
      this.createThreadCountInfo(res.threadInfo);
      this.createPieChart(res.threadInfo);
    }

    /**
     * Assigning data to array 
     */
    getWeblogicDataInfo():Array<WeblogicDataInterface>
    {
      var arrWeblogicData = [];
      if(this.weblogicDetail != undefined)
      {
        for (var i = 0; i < this.weblogicDetail.length; i++) {
          arrWeblogicData[i] = { threadName: this.weblogicDetail[i]["threadName"], workManager: this.weblogicDetail[i]["workManager"], currReq: this.weblogicDetail[i]["currReq"], totalReq: this.weblogicDetail[i]["totalReq"], threadState: this.weblogicDetail[i]["threadState"] };
        }
      }
        return arrWeblogicData;
    }

   /**
    * Method used to create filter criteria for show in top of the section
    */
    createFilterCriteria()
    { this.filterCriteria = '' ;
      if (this.selectedDC != undefined && this.selectedDC != null && this.selectedDC != '' && this.selectedDC != 'NA') {
        this.filterCriteria = 'DC=' + this.selectedDC + ', ';
      }
      else if(sessionStorage.getItem("isMultiDCMode") == "true")
            {
              let dcName = "ALL";
              if(dcName == "ALL")
                dcName = this._ddrData.dcName;
               
                this.filterCriteria = 'DC=' + dcName + ', ';
            }

      if(this.id.tierName != "NA" && this.id.tierName != "" && this.id.tierName != "undefined"&& this.id.tierName != undefined)
        this.filterCriteria += "Tier=" + this.id.tierName;
      if(this.id.serverName != "NA" && this.id.serverName != "" && this.id.serverName != "undefined" && this.id.serverName != undefined)
        this.filterCriteria += ", Server=" + this.id.serverName;
      if(this.id.appName != "NA" && this.id.appName != "" && this.id.appName != "undefined" && this.id.appName != undefined)
        this.filterCriteria += ", Instance=" + this.id.appName;
      if(this.id.startTimeInDateFormat != "NA" && this.id.startTimeInDateFormat != "" && this.id.startTimeInDateFormat != undefined&& this.id.startTimeInDateFormat != "undefined")
        this.filterCriteria += ", StartTime=" + this.id.startTimeInDateFormat;
      if(this.id.endTimeInDateFormat != "NA" && this.id.endTimeInDateFormat != "" && this.id.endTimeInDateFormat != undefined && this.id.endTimeInDateFormat != "undefined")
        this.filterCriteria += ", EndTime=" + this.id.endTimeInDateFormat;

      if(this.filterCriteria.startsWith(","))
         this.filterCriteria = this.filterCriteria.substring(1);
         
      if(this.filterCriteria.endsWith(","))
         this.filterCriteria = this.filterCriteria.substring(0,this.filterCriteria.length -1);
    }

   /**
    * This method is used to set Test Run header info which is used in download report as title
    */
    setTestRunInHeader()
    {
      if(decodeURIComponent(this.id.ipWithProd).indexOf("netstorm") != -1 )
        this.strTitle = "Netstorm - Weblogic Thread Pool Stats - Test Run : "+this.id.testRun;
      else
        this.strTitle = "Netdiagnostics Enterprise - Weblogic Thread Pool Stats - Session : "+this.id.testRun;
    }

   /**
    *This method is used to calculate total threads and active threads which is
    *used to show in pie chart subtitle sections 
    */
    getTotalAndActiveThreads(){
      return `[ Total Threads: ${this.totalThreads}, Active Threads: ${this.activeThreads} ]`;
    }

   /**
    *This method is used to create pie charts based on thread status count 
    * @param threadInfo 
    */
    createPieChart(threadInfo: any)
    {
      if(threadInfo.length == 0 || threadInfo == undefined)
      {
        this.showPieChart = false;
      }
      else
      {
       this.showPieChart = true;
      }
      var threadInfoArr = [];
      var threadStateName = threadInfo[0];
      for(var i in threadStateName)
      {
         if(i =="Idle" || i == "Hogger" || i == "Running" || i=="Standby" || i== "Stuck")
          threadInfoArr.push({"name":i,"y":Number(threadStateName[i]),"statusCount":Number(threadStateName[i])});
      }

      this.options = {
             chart : {
                 type: 'pie',
             },
             credits: {
                 enabled: false
              },
             title : { text : 'Threads State', style:{'fontSize':'13px'}},
            subtitle: {
            text: this.getTotalAndActiveThreads(),
            style: {
                fontSize: '12px',
                color: 'blue',
                fontFamily: 'Verdana',
                marginBottom: '10px'
            }
            },
             tooltip: {
             pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>Count: {point.statusCount}'
              },
             plotOptions: {
                 pie :{
                         cursor: 'pointer',
                         allowPointSelect: true,
                         dataLabels : {
                                 enabled: true,
                                 format: '<b> {point.name} </b>: {point.percentage:.2f} %',
                         },
                         showInLegend: true
                 }
             },
             series: [
                 {
                         name : 'Percentage',
                         data : threadInfoArr,
			 enableMouseTracking: true
                 }
             ]
         };
    }

  /**
   * This method is used to count the total threads and active threads
   * @param threadStateCount 
   */
    createThreadCountInfo(threadStateCount:any)
    {
      var threadStateCount = threadStateCount[0];
      this.totalThreads = threadStateCount.Total;
      this.activeThreads = threadStateCount.Active;
    }
    
    /**
     * This method is used to Chnage table data based on pie chart threas state clicked
     * @param event 
     */
    changeTableData(event)
    {
      this.showResetBtn= true;
      this.selectedThreadState = "Thread State: "+event.point.name;
      var selectThread = event.point.name;
      var sectionJson = this.weblogicDetail.filter((data) => {
       if(data.threadState == selectThread) {
         return data;
       }
      })
      this.weblogicDataInfo  = sectionJson;
    }

    /**
     * This method is used to reset the data table with all data
     */
    resetTableData()
    {
      this.showResetBtn= false;
      this.selectedThreadState = "Thread State: All";
      this.weblogicDataInfo = this.originalAllData;
    }
    //This method is used to download the Weblogic data table
    downloadReport(downloadType:string)
    {
      var jsonData="[";
      let weblogicTableRenameArray={"threadName":"Thread Name", "workManager":"Work Manager", "currReq":"Current Request","totalReq": "Total Request","threadState": "Thread State"};
      let weblogicColOrder=["Thread Name","Work Manager","Current Request","Total Request","Thread State"];
      let downloadObj:Object={
                   downloadType:downloadType,
                   strSrcFileName: "WeblogicReport",
                   strRptTitle:this.strTitle,
                   weblogicData:JSON.stringify(this.weblogicDetail),
                   weblogicTableRenameArray:JSON.stringify(weblogicTableRenameArray),
                   varFilterCriteria:this.filterCriteria,
                   weblogicColOrder:weblogicColOrder.toString()
                  }
      let downloadFileUrl;
      if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
        this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res => (
          this.openDownloadReports(res)
        ));
      }
      else
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
          (this.openDownloadReports(res)));

    }

    //To open the download file from the particular path 
    openDownloadReports(res)
    {let downloadFileUrl=decodeURIComponent(this.getHostUrl(true))+"/common/"+res; 
    window.open(downloadFileUrl);
    }
  }
