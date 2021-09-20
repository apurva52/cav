import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
import { CommonServices } from '../../services/common.services';
import 'rxjs/Rx';
import { SelectItem } from '../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from "../../../../main/services/cav-config.service";
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { DDRRequestService } from '../../services/ddr-request.service';

@Component({
  selector: 'app-flowpath-by-signature',
  templateUrl: './flowpath-by-signature.component.html',
  styleUrls: ['./flowpath-by-signature.component.css']
})

export class FlowpathBySignatureComponent implements OnInit {

  flowpathData: Array<FlowpathDataInterface>;
  columnOptions: SelectItem[];
  id: any; //common service id
  urlParam: any;
  loading = false;
  ajaxLoader = true;
  loader: boolean = false;
  headerInfo = '';
  options: Object;
  cols: any;
  showDownLoadReportIcon = true;
  strTitle: any;
  fpTotalCount: any;
  fpLimit = 50;
  fpOffset = 0;
  display: boolean = false;
  standselect: boolean = false;
  custselect: boolean = false;
  respselect: boolean = false;
  methselect: boolean = false;
  custom: string;
  standard: string;
  strDate: Date;
  endDate: Date;
  strTime: string;
  endTime: string;
  standardTime: SelectItem[];
  selectedTime: any;
  selectedResponse:any;
  msg: string;
  value: number = 1;
  trStartTime: any;
  trEndTime: any;
  reportHeader:string;
  minMethods: number;
  responseTime: number;
  timefilter: boolean=false;
  visibleCols: any[];
  selectedTab: boolean = true;
  signatureToFP = false;
  prevColumn;
  ajaxUrl : string = '' ;
   
  ngOnInit() {
    this.commonService.isToLoadSideBar = false ;
    this.loading = true;
    this.id = this.commonService.getData();
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FLOWPATHBYSIGNATURE);
    this.urlParam = this.commonService.getData();
    this.trStartTime = this.urlParam.startTime;
    this.trEndTime = this.urlParam.endTime;
    //this.reportHeader = 'FlowPath By Signature Report- ' + this.urlParam.testRun;
    this.fillData();
  }
  constructor(private commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _cavConfig: CavConfigService, 
    private flowmapDataService: DdrTxnFlowmapDataService,
    private _ddrData:DdrDataModelService,
    private breadcrumbService :DdrBreadcrumbService,
    private ddrRequest:DDRRequestService ) {

  }


  fillData() {
    try {
      this.createDropDownMenu();
      this.getFlowpathData();
      if(this._ddrData.FromhsFlag != 'true')
      this.getFlowpathDataCount();
      this.setTestRunInHeader();
      this.cols = [
        { field: 'action', header: 'Action', action: true, sortable: 'false', align: 'left', color: 'black', width: '200'},
        { field: 'flowpathCount', header: 'FlowPath Count', sortable:'custom', action: true,align: 'right', color: 'black', width: '200'},
        { field: 'min', header: 'Min (ms)', sortable:'custom', action: true, align: 'right', color: 'black', width: '200'},
        { field: 'max', header: 'Max (ms)', sortable:'custom', action: true, align: 'right', color: 'black', width: '200'},
        { field: 'average', header: 'Average (ms)', sortable:'custom', action: true, align: 'right', color: 'black', width: '200'},
        { field: 'vmr', header: 'VMR', sortable:'custom', action: true, align: 'right', color: 'black', width: '200'}
      ];

      this.visibleCols = [
        'action','flowpathCount','min','max','average','vmr'
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

 getFlowpathData()
 {
  let finalurl = '';
  this.ajaxUrl = '' ;
   try {
    if(this.commonService.enableQueryCaching == 1){
      this.ajaxUrl  = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun ;
    }
    else{
      this.ajaxUrl  = this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/flowpathreport?testRun=' + this.urlParam.testRun ;
    }

      this.ajaxUrl  +=  '&flowPathInstance=' + this.urlParam.flowPathInstance +
                        '&tierName=' + this.urlParam.tierName +
                        '&serverName=' + this.urlParam.serverName +
                        '&appName=' + this.urlParam.appName +
                        '&tierid=' + this.urlParam.tierid +
                        '&serverId=' + this.urlParam.serverid +
                        '&appId=' + this.urlParam.appid +
                        '&urlName=' + this.urlParam.urlName +
                        '&strStartTime=' + this.trStartTime +
                        '&strEndTime=' + this.trEndTime +
                        '&statusCode=-2&strGroup=flowpathsignature';

          finalurl = this.ajaxUrl;
          if(this._ddrData.FromhsFlag != 'true')
          finalurl +='&limit=' + this.fpLimit + '&offset=' + this.fpOffset + '&showCount=false';
      // making get type request to get data
      this.ddrRequest.getDataUsingGet(finalurl).subscribe(data => (this.assignFlowpathData(data)));
   }
    catch(error)
    {
      console.log('error in getting data from rest call', error);
    }
 }

 getFlowpathDataCount() {
        let finalurl = '';
        try {
            finalurl = this.ajaxUrl + '&showCount=true';
            console.log('finalurl-------->', finalurl);
            // making get type request to get data count
            this.ddrRequest.getDataUsingGet(finalurl).subscribe(data => (this.assignFlowpathDataCount(data)));

        }
        catch(error)
        {
          console.log('error in getting data from rest call', error);
        }
      }

   assignFlowpathDataCount(res:any) {
        this.fpTotalCount = res.totalCount;
        if(this.fpLimit > this.fpTotalCount)
          this.fpLimit = Number(this.fpTotalCount);
     }

  assignFlowpathData(res: any) {
    try {
      if (res === null || res === undefined) {
        return;
      }
      setTimeout(() => {
        this.loader = false;
      }, 2000);
      this.value = 1;
      this.loading = false;
      this.ajaxLoader = false;
      this.showHeaderInfo(res.strStartTime, res.strEndTime);
      let fpResponseTimeArr = [];
      // updating data in component variable
      this.flowpathData = res.data;

      if (this.flowpathData.length !== 0) {
         	this.flowpathData.forEach((val, index) => {
            if(val['average'] == 0){
              val['vmr'] = 0;
            }
            else{
              val['vmr'] = (val['vmr']/val['average']).toFixed(2);
            }
           });
        }
      //this.fpTotalCount = res.totalCount;
       if (this.flowpathData.length === 0) {
        this.showDownLoadReportIcon = false;
      }
      } catch (error) {
      console.log(error);
    }
  }

   /**used to open MethodTiming Report from Flowpath by Signature report */
  openMethodTiming(rowData) {
    let reqData = {};
    console.log('Row data is:', rowData);
      let endTimeInMs = 0;
      if (rowData !== undefined) {
        endTimeInMs = Number(rowData.startTimeInMs) + Number(rowData.fpDuration);
        reqData['average'] = rowData.average;
        reqData['flowpathCount'] = rowData.flowpathCount;
        reqData['flowpathSignature'] = rowData.flowpathSignature;
        reqData['max'] = rowData.max;
        reqData['min'] = rowData.min;
        reqData['vmr'] = rowData.vmr;
        reqData['strStartTime'] = this.trStartTime;
        reqData['strEndTime'] = this.trEndTime;
        reqData['btCatagory'] = rowData.btCatagory;
      }
      this.commonService.mtData = reqData;
      this.commonService.signatureTomt = true;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATHBYSIGNATURE;
    this._router.navigate(['/home/ddr/methodtiming']);
  }
/**used to open DB Report from Flowpath by Signature report */
    openDBReports(data) {
      this.commonService.setFPData = data;
      this.commonService.signatureToDB = true;
    this.setInStorage(data);
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATHBYSIGNATURE;
    this._router.navigate(['/home/ddr/query']);
  }

  setInStorage(data) {
      sessionStorage.removeItem('dbData');
      sessionStorage.setItem('dbData',JSON.stringify(data));
   }

/**used to open Flowpath Report from Flowpath by Signature report */
   openFlowPathCount(rowData: any) {
       this.commonService.signatureTofpData = rowData;
       this.commonService.signatureTofpFlag = true;
        this.commonService.removeAllComponentFromFlowpath()
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FLOWPATHBYSIGNATURE;
        this._router.navigate(['/home/ddr/flowpath']);
      }
  
    showHeaderInfo(startTime: any, endTime: any) {
    if (this.urlParam.tierName !== 'NA' && this.urlParam.tierName !== '' && this.urlParam.tierName !== undefined &&
      this.urlParam.tierName !== null) {
      this.headerInfo = 'Tier=' + this.urlParam.tierName;
    }

    if (this.urlParam.serverName !== 'NA' && this.urlParam.serverName !== '' && this.urlParam.serverName !== undefined &&
      this.urlParam.serverName !== null) {
      this.headerInfo += ', Server=' + this.urlParam.serverName;
    }
    if (this.urlParam.appName !== 'NA' && this.urlParam.appName !== '' && this.urlParam.appName !== undefined &&
      this.urlParam.appName !== null) {
      this.headerInfo += ', Instance=' + this.urlParam.appName;
    }
    if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      this.headerInfo += ', StartTime=' + startTime;
    }
    if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
      this.headerInfo += ', EndTime=' + endTime;
    }
    console.log('headerinfo', this.headerInfo);
    if (this.headerInfo.startsWith(',')) {
      this.headerInfo = this.headerInfo.substring(1);
    }
    if (this.headerInfo.endsWith(',')) {
      this.headerInfo = this.headerInfo.substring(0, this.headerInfo.length - 1);
    }

    if (this.methselect==true)
      this.headerInfo += ', Method Count >=' + this.minMethods;
    else
      this.headerInfo += '';

   if(this.respselect==true && this.selectedResponse != ""){
    if (this.respselect==true &&this.selectedResponse.id == 10)
     this.headerInfo += ', Response Time <=' + this.responseTime;
      else if (this.respselect==true &&this.selectedResponse.id == 11)
        this.headerInfo += ', Response Time >=' + this.responseTime;
          else if (this.respselect==true &&this.selectedResponse.id == 12)
            this.headerInfo += ', Response Time =' + this.responseTime;
   }        
    else
      this.headerInfo += '';  


}
 openFPDetailTab()
  {
    this.selectedTab = false;
  }

  closeFPDetailTab()
  {
    this.selectedTab = true;
  }


  //Time filter


  createDropDownMenu() {
    this.standardTime = [];
    this.standardTime.push({ label: 'Last 10 minutes', value: { id: 1, name: 'Last 10 minutes', code: '10min' } });
    this.standardTime.push({ label: 'Last 30 minutes', value: { id: 2, name: 'Last 30 minutes', code: '30min' } });
    this.standardTime.push({ label: 'Last 1 hour', value: { id: 3, name: 'Last 1 hour', code: '1hr' } });
    this.standardTime.push({ label: 'Last 2 hours', value: { id: 4, name: 'Last 2 hours', code: '2hrs' } });
    this.standardTime.push({ label: 'Last 4 hours', value: { id: 5, name: 'Last 4 hours', code: '4hrs' } });
    this.standardTime.push({ label: 'Last 8 hours', value: { id: 6, name: 'Last 8 hours', code: '8hrs' } });
    this.standardTime.push({ label: 'Last 12 hours', value: { id: 7, name: 'Last 12 hours', code: '12hrs' } });
    this.standardTime.push({ label: 'Last 24 hours', value: { id: 8, name: 'Last 24 hours', code: '24hrs' } });
    this.standardTime.push({ label: 'Total Test Run', value: { id: 9, name: 'Total Test Run', code: 'TTS' } });
  }

  onStrDate(event) {
    let d = new Date(Date.parse(event));
    this.strTime = `${d.getTime()}`;
    console.log(this.strTime);
  }

  onEndDate(event) {
    let d = new Date(Date.parse(event));
    this.endTime = `${d.getTime()}`;
    console.log(this.endTime);
  }

  applyFilter() {
    if (this.custselect == true) {
      if (this.strDate == null || this.endDate == null) {
        if (this.strDate == null && this.endDate != null)
          this.msg = "Start time cannot be empty";
        else if (this.endDate == null && this.strDate != null)
          this.msg = "End time cannot be empty"
        else
          this.msg = "Start time and end time cannot be empty";
      }
      else {
        if (this.strDate > this.endDate)
          this.msg = "Start time cannot be greater than end time";
        else {
          this.trStartTime = this.strTime;
          this.trEndTime = this.endTime;
          this.display = false;
          this.loader = true;
          this.getProgressBar();
          this.getFlowpathData();
          this.getFlowpathDataCount();
          this.custselect = false;
          this.standselect = true;
          this.strDate = null;
          this.endDate = null;
          this.msg = "";
          this.value = 1;
        }
      }
    }
    else if (this.standselect == true) {
      if (this.selectedTime == "" || this.selectedTime == undefined)
        this.msg = 'Selected time is not valid';
      else {
        let restDrillDownUrl = this.id.restDrillDownUrl;
        this.ddrRequest.getDataUsingGet(restDrillDownUrl).subscribe(data => (this.setTimeFilter(data)));
      }
    }
  }

  close() {
    this.display = false;
    this.standselect = true;
    this.custselect = false;
    this.strDate = null;
    this.endDate = null;
    this.selectedTime = "";

  }

  standFunction() {
    this.msg = "";
    this.standselect = false;
    this.custselect = true;
    this.selectedTime = "";
  }
  custFunction() {
    this.strDate = null;
    this.endDate = null;
    this.msg = "";
    this.custselect = false;
    this.standselect = true;
  }
  showTimeDialog() {
    this.display = true;
    this.msg="";
  }

  getProgressBar() {
    let interval = setInterval(() => {
      this.value = this.value + Math.floor(Math.random() * 10) + 1;
      if (this.value >= 100) {
        this.value = 100;
        clearInterval(interval);
      }
    }, 300);
  }

  setTimeFilter(res: any) {
    this.trStartTime = res.ddrStartTime;
    this.trEndTime = res.ddrEndTime;
    this.getStandardTime();
  }
  getStandardTime() {
    if (this.trStartTime != "" || this.trStartTime != undefined) {
      let time;
      if (this.selectedTime.name == "Last 10 minutes") {
        time = 600000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 10 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 30 minutes") {
        time = 1800000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 30 Minutes this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 1 hour") {
        time = 3600000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 1 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 2 hours") {
        time = 7200000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 2 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 4 hours") {
        time = 14400000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 4 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 8 hours") {
        time = 28800000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 8 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 12 hours") {
        time = 43200000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 12 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Last 24 hours") {
        time = 86400000;
        this.trStartTime = this.trEndTime - time;
        console.log(" last 24 hour this.trStartTime===", this.trStartTime, "this.trEndTime===", this.trEndTime);
      }
      else if (this.selectedTime.name == "Total Test Run") {
        this.trStartTime = "";
        this.trEndTime = "";
      }
     this.loader = true;
      this.getProgressBar();
      this.getFlowpathData();
      this.standselect = true;
      this.custselect = false;
      this.display = false;
      this.strDate = null;
      this.endDate = null;
      this.msg = "";
      this.value = 1;
      this.selectedTime = "";
    }
  }

     /*Method is used get host url*/

    getHostUrl(): string {
    var hostDcName = this._ddrData.getHostUrl();
    // if (this._navService.getDCNameForScreen("flowpath") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    //   hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }
 


     setTestRunInHeader() {
    if (decodeURIComponent(this.urlParam.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - Flowpath Report - Test Run : ' + this.urlParam.testRun;
       } else {
      this.strTitle = 'Netdiagnostics Enterprise - Flowpath Report - Session : ' + this.urlParam.testRun;
          }
     }

     

       paginate(event) {
    // event.first = Index of the first record  (used  as offset in query) 
    // event.rows = Number of rows to display in new page  (used as limit in query)
    // event.page = Index of the new page
    // event.pageCount = Total number of pages

    
    this.fpOffset = parseInt(event.first); 
    this.fpLimit = parseInt(event.rows); 

     if(this.fpLimit > this.fpTotalCount)
       this.fpLimit = Number(this.fpTotalCount);     
       
    if((this.fpLimit + this.fpOffset) > this.fpTotalCount)
      this.fpLimit = Number(this.fpTotalCount) - Number(this.fpOffset);

    this.getFlowpathData();
  }
   sortColumnsOnCustom(event, tempData) {

    //for interger type data type
    if (event["field"] == "startTime") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.flowpathData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
       tempData.map((rowdata) => { this.flowpathData = this.Immutablepush(this.flowpathData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

downloadReports(reports: string) {
  
  let renameArray = {'flowpathCount': 'FlowPath Count', 'min': 'Min (ms)', 'max': 'Max (ms)','average': 'Average (ms)', 'vmr': 'VMR'}
	  
  let colOrder = ['FlowPath Count','Min (ms)','Max (ms)','Average (ms)','VMR'];
 // console.log("flowpathData=========== ", JSON.stringify(this.flowpathData));
	
	this.flowpathData.forEach((val, index) => {
            delete val['flowpathSignature'];
            delete val['id']; 
			      delete val['coherenceCallOut'];
            delete val['jmsCallOut'];
			      delete val['waitTime']; 
            delete val['syncTime'];
		      	delete val['iotime'];
            delete val['suspensiontime'];
            delete val['threadName'];
            
          });
		    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.headerInfo,
      strSrcFileName: 'FlowpathReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.flowpathData)
    };
    let downloadFileUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product) +
      '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
      (this.openDownloadReports(res)));
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
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open(decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product).replace('/netstorm', '').replace('/netdiagnostics', '') +
      '/common/' + res);
  }

}
   
export interface FlowpathDataInterface {
  tierName: string;
  tierId: string;
  serverName: string;
  serverId: string;
  appName: string;
  appId: string;
  urlName: string;
  urlIndex: string;
  flowpathInstance: string;
  prevFlowpathInstance: string;
  startTime: string;
  btCatagory: string;
  fpDuration: string;
  methodsCount: string;
  urlQueryParamStr: string;
  statusCode: string;
  callOutCount: string;
  startTimeInMs: string;
  id: number;
  orderId: string;
  totalError: string;
  threadName: string;
}
