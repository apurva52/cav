import { Component, OnInit, OnDestroy, Input,Output,EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonServices } from '../../../services/common.services';
// import 'rxjs/Rx';
import { Location } from '@angular/common';
import { SelectItem,Message } from 'primeng/primeng';
import { customFrameInterface, hotspotSecInterface } from '../../../interfaces/group-by-custom-data-info';
import { CavConfigService } from "../../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import { DdrDataModelService } from '../../../../tools/actions/dumps/service/ddr-data-model.service';
// import { error } from 'util';
import { DDRRequestService } from '../../../services/ddr-request.service';
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';

@Component({
  selector: 'app-group-by-custom',
  templateUrl: './group-by-custom.component.html',
  styleUrls: ['./group-by-custom.component.css']
})
export class GroupByCustomComponent implements OnInit {

  @Input() index:number;
  @Input() topFrame:number;
  @Output() stSignature = new EventEmitter();

  //variable used for paginator
  // hsTotalCount: any;
  // hsLimit = 10;
  // hsOffset = 0;
 
  //variable used for disable/enable loader image
   ajaxLoader = false;
   strTitle:string;
   selectedTimeRange:string;
   stackTrace:string;
   loading:boolean=false;
   selectedValue:any;
   startTimeInDate:string;
   endTimeInDate:string;

   //variable used to create stacktrace table header dynamically
   stackTraceFilter:string;
 
   hotspotFilter:string
   hideTimeFilters:boolean;
   hideTimeRange:boolean;
   timeRange: SelectItem[];
   id:any;
   errMsg:Message[];
   downloadJSON = []; 
   //Structured for hotspot 1st table 
   hotspotData:Object[] = [{"CompareST":"","STSignature":"","CompareDepth":"","DisplayName":"","TopMethods":"","Count":"","Min":"","Max":"","Average":"","Variance":"","Tierid":"","Serverid":"","Appid":"","MinDepth":"","MaxDepth":"","MinToolTip":"","MaxToolTip":"","AvgToolTip":"","VmrToolTip":""}];
   //Structured for hotspot 2nd table 
   hotspotSecData:Object[] = [{"0":"","1":"","2":"","3":"","4":"","5":"","6":"","7":""}];
   //Used to show the stacktrace information for first time
   selectItem :Object={"CompareST":"","STSignature":"","CompareDepth":"","DisplayName":"","TopMethods":"","Count":"","Min":"","Max":"","Average":"","Variance":"","Tierid":"","Serverid":"","Appid":"","MinDepth":"","MaxDepth":"","MinToolTip":"","MaxToolTip":"","AvgToolTip":"","VmrToolTip":""};
  
   hotSpotInfo:Array<customFrameInterface>;
   hotSpotSecInfo: TreeNode[];

  // Variable used for table column creation and show/hide columns
  colsForSignature: any;
  colsForStackTrace: any;
  visibleColsForSignature: any[];
  visibleColsForStackTrace: any[];
  columnOptionsForSignature: SelectItem[];
  columnOptionsForStackTrace: SelectItem[];
  prevColumnForSignature;
  prevColumnForStackTrace;

  // Varibles used for column level filter
  toggleFilterTitleForSignature = '';
  isEnabledColumnFilterForSignature = false;
  toggleFilterTitleForStack = '';
  isEnabledColumnFilterForStack = true;
  showDownLoadReportIcon: boolean = true;

  constructor(private commonService: CommonServices,private route: ActivatedRoute, private router: Router, private location: Location, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService,private _ddrData:DdrDataModelService,
    private ddrRequest:DDRRequestService)  {
   
   }

  ngOnInit() {
    this.ajaxLoader = true;
    this.loading = true;
    this.id = this.commonService.getData();
    this.createDropDownMenu();
    this.createCols();
    this.startTimeInDate = this.id.startTimeInDateFormat;
    this.endTimeInDate = this.id.endTimeInDateFormat;
    this.createTimeRangeHeader();
    this.clickGroupBy(this.topFrame);
    this.setTestRunInHeader();
  }


  createCols() {

    this.colsForSignature = [
      { field: 'DisplayName', header: 'StackTrace Signature', sortable: true, action: true, align: 'left', color: 'blue', width: '206' },
      { field: 'TopMethods', header: 'StackTrace(Top Methods)', sortable: true, action: true, align: 'left', color: 'black', width: '207' },
      { field: 'CompareDepth', header: 'Compare Depth', sortable: true, action: true, align: 'right', color: 'black', width: '113' },
      { field: 'MinDepth', header: 'Min Depth', sortable: 'custom', action: true, align: 'right', color: 'black', width: '113' },
      { field: 'MaxDepth', header: 'Max Depth', sortable: 'custom', action: true, align: 'right', color: 'black', width: '113' },
      { field: 'Count', header: 'Thread Count(s)', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '113' },
      { field: 'Min', header: 'Min Duration', sortable: 'custom', action: true, align: 'right', color: 'black', width: '113' },
      { field: 'Max', header: 'Max Duration', sortable: 'custom', action: true, align: 'right', color: 'black', width: '113' },
      { field: 'Average', header: 'Avg. Duration', sortable: 'custom', action: true, align: 'right', color: 'black', width: '113' },
      { field: 'Variance', header: 'VMR', sortable: 'custom', action: true, align: 'right', color: 'black', width: '113' }
    ];

    this.colsForStackTrace = [
      { field: 'methodName', header: 'Method', sortable: false, action: true, align: 'left', width: '30%' },
      { field: 'className', header: 'Class', sortable: false, action: true, align: 'left', width: '50%' },
      { field: 'lineNo', header: 'Line', sortable: false, action: true, align: 'right', width: '15%' },
      { field: 'packageName', header: 'Source File', sortable: false, action: true, align: 'left', width: '25%'},
      //{ field: 'elapsedTime', header: 'Elapsed Time', sortable: false, action: true, align: 'right', width: '20%'},
      { field: 'frameNo', header: 'Frame', sortable: false, action: true, align: 'right', width: '15%'}
    ];

    this.visibleColsForSignature = [
      'DisplayName', 'TopMethods', 'CompareDepth', 'MinDepth', 'MaxDepth', 'Count', 'Min', 'Max', 'Average', 'Variance'
    ];

    this.columnOptionsForSignature = [];
    for (let i = 0; i < this.colsForSignature.length; i++) {
      this.columnOptionsForSignature.push({ label: this.colsForSignature[i].header, value: this.colsForSignature[i].field });
    }

    this.visibleColsForStackTrace = [
      '4', '3', '2', '1', '0'
    ];

    this.columnOptionsForStackTrace = [];
    for (let i = 0; i < this.colsForStackTrace.length; i++) {
      this.columnOptionsForStackTrace.push({ label: this.colsForStackTrace[i].header, value: this.colsForStackTrace[i].field });
    }
  }


  ngOnDestroy()
  {
    this.commonService.indexArr.push(2);
  }
  createDropDownMenu()
  {
    this.timeRange = [];
    this.timeRange.push({ label: 'Last 10 Min', value: '10' });
    this.timeRange.push({ label: 'Last 20 Min', value: '20' });
    this.timeRange.push({ label: 'Last 30 Min', value: '30' });
    this.timeRange.push({ label: 'Last 40 Min', value: '40' });
    this.timeRange.push({ label: 'Last 50 Min', value: '50' });
    this.timeRange.push({ label: 'Last 60 Min', value: '60' });
  }


  setTestRunInHeader()
      {
        if(decodeURIComponent(this.getHostUrl() + '/' + this.id.product ).indexOf("netstorm") != -1 )
         this.strTitle = "Netstorm - Thread HotSpots - Test Run : "+this.id.testRun;
         else
         this.strTitle = "Netdiagnostics Enterprise - Thread HotSpots - Session : "+this.id.testRun;
      }
   createTimeRangeHeader()
    {
      if(this.id.isZoomPanel == "true")
       {
         this.hideTimeFilters = true;
         this.hideTimeRange = false;
       }
       else
        {
          this.hideTimeFilters = false;
          this.hideTimeRange = true;
        }
      //  console.log("**************************");
      //  console.log("this.hideTimeFilters = " ,this.hideTimeFilters);
      //  console.log("this.hideTimeRange = " ,this.hideTimeRange);
      //  console.log("**************************");
    }
   
   //Method to open groupby screen based on depth
   clickGroupBy(groupByVal)
    {var endpoint_url
    //   if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    //   endpoint_url = this._ddrData.protocol + "://" + this.getHostUrl();
    // else
      endpoint_url = this.getHostUrl()

      if(this.commonService.enableQueryCaching == 1){
      endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?cacheId="+ this.id.testRun + "&testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime+"&depth="+groupByVal + "&showCount=false";     
      }
      else{
        endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime+"&depth="+groupByVal + "&showCount=false";
      }

       this.ajaxLoader = true;
      try{
         return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.doAssignValueHotspot(data)),error=>{
           this.loading=false;
           console.error(error);
         });
   }
   catch(error)
   {
     this.loading=false;
     console.error(error);
   }
  }

    

  //To set thread stacktrace header information
  getSelected(event)
  { 
     this.selectItem=event.data;
  }
 
  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if( !isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    {
      //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      this.id.testRun=this._ddrData.testRun;
      console.log("all case url==>",hostDcName,"all case test run==>",this.id.testRun);
    }
  //  else if (this._navService.getDCNameForScreen("threadhotspot") === undefined)
  //     hostDcName = this._cavConfigService.getINSPrefix();
  //   else
  //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("threadhotspot");

  //   if (hostDcName.length > 0) {
  //     sessionStorage.removeItem("hostDcName");
  //     sessionStorage.setItem("hostDcName", hostDcName);
  //   }
  //   else
  //     hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }
  
  //Method to apply filtes based on input
  clickApply(searchVal,timeVal)
  {
    if ((searchVal == undefined) && (timeVal == undefined)) {
      alert("Please enter some valid value");
      return;
    }
    else {
      var strStartTime;
      var strEndTime;
      var timeFilterUrl;
      if(this.id.product.replace("/","") == "netstorm" && timeVal != undefined){
        timeFilterUrl =  this.getHostUrl() + '/' + this.id.product.replace("/","")+ '/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=' + this.id.testRun
 
      timeFilterUrl = timeFilterUrl + "&graphTimeKey=" + timeVal;
      console.log("time filter call outgoing ddrsideBar",timeFilterUrl);
      this.ajaxLoader = true;
      this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => (this.setTimeFilter(data,searchVal)));
    }
    else{
      if (timeVal != undefined) {
        timeVal = Number(timeVal) * 60 * 1000;  //dropdown(nTime) value to ms
        var testDuration = Number(this.id.endTime) - Number(this.id.startTime);
        if (testDuration > timeVal) {
          var applyST = Number(this.id.endTime) - timeVal;
          strStartTime = applyST;
          strEndTime = this.id.endTime;
        }
        else //calculate end time when test is less than input time
        {
          alert("Filters time is greater than test run total time");
          strStartTime = Number(this.id.endTime) - Number(testDuration);
          strEndTime = this.id.endTime;
        }
      }
      else {
        strStartTime = this.id.startTime;
        strEndTime = this.id.endTime;
      }   
      var endpoint_url; 
    //   if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    //   endpoint_url = this._ddrData.protocol + "://" + this.getHostUrl();
    // else
      endpoint_url = this.getHostUrl();

      if(this.commonService.enableQueryCaching == 1){      
         endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?cacheId="+ this.id.testRun + "&testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+strStartTime+"&strEndTime="+strEndTime+"&searchKeyVal="+searchVal+"&depth="+this.topFrame;
      }
      else{
        endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+strStartTime+"&strEndTime="+strEndTime+"&searchKeyVal="+searchVal+"&depth="+this.topFrame;        
      }
          this.ajaxLoader = true;
      try {
        return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.doAssignValueHotspot(data)), error => {
          this.loading = false;
          console.error(error);
        })
      }
      catch (error) {
        this.loading = false;
        console.error(error);
      }
     }
    }
  }
  setTimeFilter(res:any, searchVal: any): void {
    console.log("set time filter is hots ", res);
    var strStartTime;
    var strEndTime;
    var endpoint_url;
    strStartTime =res.ddrStartTime ;
    strEndTime =res.ddrEndTime ;

    endpoint_url = this.getHostUrl();

    if(this.commonService.enableQueryCaching == 1){      
      endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?cacheId="+ this.id.testRun + "&testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+strStartTime+"&strEndTime="+strEndTime+"&searchKeyVal="+searchVal+"&depth="+this.topFrame;
   }
   else{
     endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+strStartTime+"&strEndTime="+strEndTime+"&searchKeyVal="+searchVal+"&depth="+this.topFrame;        
   }
   try {
       this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.doAssignValueHotspot(data)), error => {
       this.loading = false;
       console.error(error);
     })
   }
   catch (error) {
     this.loading = false;
     console.error(error);
   }
  }
    //Whenn clicked on thread count
    clickOnThreadCount(displayName,signatureName,compareDepth)
     {
        let dataArr = [];
        dataArr.push(displayName);
        dataArr.push(signatureName);
        dataArr.push(0);
        dataArr.push(compareDepth);
        this.stSignature.emit(dataArr);
     }  
    
    /*
    **FUnction used to custom sort for intger and float
    */
      threadHotspotSort(event, hotSpotInfo) {
        //console.log(event)
        let fieldValue = event["field"];
        if (fieldValue == "MinDepth" || fieldValue == "MaxDepth" || fieldValue == "Count") {
          if (event.order == -1) {
            event.order = 1
            hotSpotInfo = hotSpotInfo.sort(function (a, b) {
              var value = parseInt(a[fieldValue]);
              var value2 = parseInt(b[fieldValue]);
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
          }
          else {
            event.order = -1;
            //asecding order
            hotSpotInfo = hotSpotInfo.sort(function (a, b) {
              var value = parseInt(a[fieldValue]);
              var value2 = parseInt(b[fieldValue]);
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
          }
        }
        if (fieldValue == "Min" || fieldValue == "Max" || fieldValue == "Average" || fieldValue == "Variance") {
          if (event.order == -1) {
            event.order = 1
            hotSpotInfo = hotSpotInfo.sort(function (a, b) {
              var value = parseFloat(a[fieldValue]);
              var value2 = parseFloat(b[fieldValue]);
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
          }
          else {
            event.order = -1;
            //asecding order
            hotSpotInfo = hotSpotInfo.sort(function (a, b) {
              var value = parseFloat(a[fieldValue]);
              var value2 = parseFloat(b[fieldValue]);
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
          }
        }
       // this.hotSpotInfo = hotSpotInfo;
        this.hotSpotInfo = [];
        //console.log(JSON.stringify(tempData));
        if (hotSpotInfo) {
          hotSpotInfo.map((rowdata) => { this.hotSpotInfo = this.Immutablepush(this.hotSpotInfo, rowdata) });
        }
    
      }


  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }
    stackTraceSort(event,hotSpotSecInfo)
    {
      //console.log("in second case");
      let fieldValue=event["field"];
    if(fieldValue=="4" || fieldValue=="2")
    {
     if(event.order == -1)
     {
       event.order = 1
        hotSpotSecInfo = hotSpotSecInfo.sort(function(a, b) {
      var value = parseInt(a[fieldValue]);
      var value2 = parseInt(b[fieldValue]);
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
         });
       }
    else
    {
      event.order = -1;
      //asecding order
 hotSpotSecInfo = hotSpotSecInfo.sort(function(a, b) {
      var value = parseInt(a[fieldValue]);
      var value2 = parseInt(b[fieldValue]);
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
         });
    }
    }
    //this.hotSpotSecInfo=hotSpotSecInfo;
    this.hotSpotSecInfo = [];
    //console.log(JSON.stringify(tempData));
    if (hotSpotSecInfo) {
      hotSpotSecInfo.map((rowdata) => { this.hotSpotSecInfo = this.Immutablepush(this.hotSpotSecInfo, rowdata) });
    }

  }
    //Method to reset the data
    clickReset(searchFilter:any)
    {
      searchFilter = undefined;
      this.ajaxLoader = true;
      this.getHotspotData();
    }
  
   //Method to get data when clcik on thread id -for thread stack trace
   passDataForStackTrace(data :any)
   { 
     this.stackTraceFilter=`(Signature:${data.STSignature}, Thread Count(s):${ data.Count}, Average Duration:${ data.Average} seconds)`;
     //console.log("stacktrace filter----"+ this.stackTraceFilter);
     let second_url: string;
    //  if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    //    second_url = this._ddrData.protocol + "://" + this.getHostUrl();
    //  else
       second_url = this.getHostUrl()

       if(this.commonService.enableQueryCaching == 1){
        second_url +='/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?cacheId="+ this.id.testRun + "&testRun="+this.id.testRun+"&tierId="+data.Tierid+"&serverId="+data.Serverid+"&appId="+data.Appid+"&stsignature="+data.STSignature+"&depth="+data.CompareDepth+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime+"&minDepth="+data.MinDepth+"&maxDepth="+data.MaxDepth;
       }
       else{
         second_url +='/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASStackTraceData?testRun="+this.id.testRun+"&tierId="+data.Tierid+"&serverId="+data.Serverid+"&appId="+data.Appid+"&stsignature="+data.STSignature+"&depth="+data.CompareDepth+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime+"&minDepth="+data.MinDepth+"&maxDepth="+data.MaxDepth;
       }
     // console.log("second url-----------"+second_url);
      this.ajaxLoader = true;
      this.getHotspotSecData(second_url);
   }

	 //Rest call to get data as a response for thread info table
   getHotspotData()
   {var endpoint_url;
    //  if (sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    //    endpoint_url = this._ddrData.protocol + "://" + this.getHostUrl();
    //  else
       endpoint_url = this.getHostUrl()
     //console.log(this.commonServices.id.compDepth+"depth value");

     if(this.commonService.enableQueryCaching == 1){
      endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?cacheId="+ this.id.testRun + "&testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime+"&depth="+this.topFrame;
     }
     else{
      endpoint_url += '/' + this.id.product.replace("/","") +"/v1/cavisson/netdiagnostics/ddr/ASGroupFrameData?testRun="+this.id.testRun+"&tierName="+this.id.tierName+"&serverName="+this.id.serverName+"&appName="+this.id.appName+"&strStartTime="+this.id.startTime+"&strEndTime="+this.id.endTime+"&depth="+this.topFrame;
     }

       this.ajaxLoader = true;
       //console.log("endpoint url------------",endpoint_url);
       endpoint_url += "&showCount=false";
     try {
       return this.ddrRequest.getDataUsingGet(endpoint_url).subscribe(data => (this.doAssignValueHotspot(data)), error => {
         this.loading = false;
         console.error(error);
       });
     }
     catch (error) {
       this.loading = false;
       console.error(error);
     }
   }

  // paginate(event) {
  //   console.log(event);
  //     this.hsOffset = parseInt(event.first); 
  //     this.hsLimit = parseInt(event.rows); 
  //     this.getHotspotData();
  //   }


   //Rest call to get data as a response for thread stackTrace table 
  getHotspotSecData(second_url?: string) {
    try {
      return this.ddrRequest.getDataUsingGet(second_url).subscribe(data => (this.doAssignValueSecHotspot(data)), error => {
        this.loading = false;
        console.error(error);
      });

    }
    catch (error) {
      this.loading = false;
      console.error(error);
    }
  }

  //Assign hotspot response value to the firstarray
  doAssignValueHotspot(res :any)
  {
   this.ajaxLoader = false;
   this.loading = false;
   if (res.hasOwnProperty('Status')) {
    this.showError(res.Status);
   }
   this.hotspotData=res.data;
   let count = this.hotspotData.length;
   if(!count)
    count = 0;
    if(res.startTime && res.startTime != "undefined")
     this.hotspotFilter = "(Total:" + count + ", Start Time:" + res.startTime + ", End Time:" + res.endTime + ", Tier:" + this.id.tierName + ", Server:" + this.id.serverName + ", Instance:" + this.id.appName + ")";
    else 
     this.hotspotFilter = "(Total:" + count + ", Tier:" + this.id.tierName + ", Server:" + this.id.serverName + ", Instance:" + this.id.appName + ")";
   
   if(this.hotspotData.length==0)
    {
    // console.log("in this condition");
     this.hotSpotSecInfo=[];
     this.stackTraceFilter="";
     this.showDownLoadReportIcon = false;
    }
    else
      this.showDownLoadReportIcon = true; 
    
   this.hotSpotInfo = this.getHotspotInfo();
  // console.log("hotspt onfp --------"+JSON.stringify(this.hotSpotInfo));
   }

   //Assign hotspot response value to the secondarray
   doAssignValueSecHotspot(res :any){
   this.ajaxLoader = false;
   this.hotspotSecData = res.treedata;
   this.hotSpotSecInfo = res.treedata;
   this.downloadJSON = res.downloadJSON;
    }

//Store value for thread data
 getHotspotInfo():Array<customFrameInterface>
   {
     var arrHotSpotData  =[];
     for(var i = 0;i<this.hotspotData.length;i++)
     {
        if(i == 0)
       {
         this.passDataForStackTrace(this.hotspotData[i]);//
         this.selectItem=this.hotspotData[i];
       }
     
      var minDur = this.numberToLocalString(this.hotspotData[i]["Min"]);
      var maxDur = this.numberToLocalString(this.hotspotData[i]["Max"]);
      var avgDur = this.numberToLocalString(this.hotspotData[i]["Average"]);
      
     arrHotSpotData[i] = {CompareST:this.hotspotData[i]["CompareST"],STSignature:this.hotspotData[i]["STSignature"],CompareDepth:this.hotspotData[i]["CompareDepth"],DisplayName:this.hotspotData[i]["DisplayName"],TopMethods:this.hotspotData[i]["TopMethods"],Count:this.hotspotData[i]["Count"],Min:minDur,Max:maxDur,Average:avgDur,Variance:this.hotspotData[i]["Variance"],Tierid:this.hotspotData[i]["Tierid"],Serverid:this.hotspotData[i]["Serverid"],Appid:this.hotspotData[i]["Appid"],MinDepth:this.hotspotData[i]["MinDepth"],MaxDepth:this.hotspotData[i]["MaxDepth"],MinToolTip:this.hotspotData[i]["MinToolTip"],MaxToolTip:this.hotspotData[i]["MaxToolTip"],AvgToolTip:this.hotspotData[i]["AvgToolTip"],VmrToolTip:this.hotspotData[i]["VmrToolTip"]};
     }
     return arrHotSpotData;
   }
    
  //Store value for thread stacktrace data
  getHotspotSecInfo():Array<hotspotSecInterface>
   {
     var arrHotSpotSecData  =[];
     for(var i = 0;i<this.hotspotSecData.length;i++)
     {
       arrHotSpotSecData[i] = {0:this.hotspotSecData[i]["0"],1:this.hotspotSecData[i]["1"],2:this.hotspotSecData[i]["2"],3:this.hotspotSecData[i]["3"],4:this.hotspotSecData[i]["4"],5:this.hotspotSecData[i]["5"],6:this.hotspotSecData[i]["6"],7:this.hotspotSecData[i]["7"]};
     }
     return arrHotSpotSecData;
  }
  downloadReport(downloadType:string)
    {
      let renameArray={"DisplayName":"StackTrace Signature","TopMethods":"StackTrace(Top Methods)","CompareDepth":"Compare Depth","MinDepth":"Min Depth","MaxDepth":"Max Depth","Count":"Thread Count(s)","Min":"Min Duration","Max":"Max Duration","Average":"Avg Duration","Variance":"Variance"};
      let secondRenameArray={ "methodName": "Method", "className": "Class", "lineNo": "Line", "packageName": "Source File", "elapsedTime": "Elapsed Time (ms)", "frameNo": "Frame" };
     let colOrder=["StackTrace Signature","StackTrace(Top Methods)","Compare Depth","Min Depth","Max Depth","Thread Count(s)","Min Duration","Max Duration","Avg Duration","Variance"];
      let colOrder1=["Method", "Class", "Line", "Source File", "Elapsed Time (ms)", "Frame"];
          // alert("download type ---"+downloadType);
           this.hotspotData.forEach((val,index)=>
                 { delete val['STSignature'];
                   delete val['CompareST'];
                   delete val['Tierid'];
                   delete val['Serverid'];
                   delete val['Appid'];
                   delete val['MinToolTip'];
                   delete val['MaxToolTip'];
                   delete val['AvgToolTip'];
                   delete val['VmrToolTip'];
                  }); 
              //    alert("stringify-----"+JSON.stringify(this.hotspotData)); 
              
                   this.downloadJSON=this.downloadJSON.filter(val=>delete val['count']); 
                   let downloadObj:Object={
                   downloadType:downloadType,
                   strSrcFileName: "customFrameASReport",
                   strRptTitle:this.strTitle,
                   threadDumpData :JSON.stringify(this.hotspotData),
                   threadDumpRenameArray :JSON.stringify(renameArray),
                   threadDetailData:JSON.stringify(this.downloadJSON),
                   threadDetailRenameArray:JSON.stringify(secondRenameArray),
                   varFilterCriteria:this.hotspotFilter,
                   threadDumpColOrder:colOrder.toString(),
                   threadDetailColOrder:colOrder1.toString()
                   }
    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.id.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res => (this.openDownloadReports(res)));
    else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (this.openDownloadReports(res)));
  }
    openDownloadReports(res)
  {
//console.log("file name generate ===",res)
//console.log("//"+decodeURIComponent(this.commonServices.id.ipWithProd).replace("/netstorm","").replace("/netdiagnostics","")+"/common/"+res);
window.open(decodeURIComponent(this.getHostUrl(true))+"/common/"+res);
  }

//This method is used to convert number to comma format(e.g -123456 ->1,23,456)
 numberToLocalString(num)
 {
   return num.toLocaleString();
 }
 showError(msg: any) {
  this.errMsg = [];
  this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
 }

  showHideColumnForSignature(data: any) {
    if (this.visibleColsForSignature.length === 1) {
      this.prevColumnForSignature = this.visibleColsForSignature[0];
    }
    if (this.visibleColsForSignature.length === 0) {
      this.visibleColsForSignature.push(this.prevColumnForSignature);
    }
    if (this.visibleColsForSignature.length !== 0) {
      for (let i = 0; i < this.colsForSignature.length; i++) {
        for (let j = 0; j < this.visibleColsForSignature.length; j++) {
          if (this.colsForSignature[i].field === this.visibleColsForSignature[j]) {
            this.colsForSignature[i].action = true;
            break;
          } else {
            this.colsForSignature[i].action = false;
          }
        }
      }
    }
  }

  showHideColumnForStackTrace(data: any) {
    if (this.visibleColsForStackTrace.length === 1) {
      this.prevColumnForStackTrace = this.visibleColsForStackTrace[0];
    }
    if (this.visibleColsForStackTrace.length === 0) {
      this.visibleColsForStackTrace.push(this.prevColumnForStackTrace);
    }
    if (this.visibleColsForStackTrace.length !== 0) {
      for (let i = 0; i < this.colsForStackTrace.length; i++) {
        for (let j = 0; j < this.visibleColsForStackTrace.length; j++) {
          if (this.colsForStackTrace[i].field === this.visibleColsForStackTrace[j]) {
            this.colsForStackTrace[i].action = true;
            break;
          } else {
            this.colsForStackTrace[i].action = false;
          }
        }
      }
    }
  }

  toggleColumnFilterForSignature() {
    this.isEnabledColumnFilterForSignature = !this.isEnabledColumnFilterForSignature; 
    // if (this.isEnabledColumnFilterForSignature) {
    //   this.isEnabledColumnFilterForSignature = false;
    // } else {
    //   this.isEnabledColumnFilterForSignature = true;
    // }
    this.changeColumnFilterForSignature();
  }

  toggleColumnFilterForStack() {
    if (this.isEnabledColumnFilterForStack) {
      this.isEnabledColumnFilterForStack = false;
    } else {
      this.isEnabledColumnFilterForStack = true;
    }
    this.changeColumnFilterForStack();
  }

  changeColumnFilterForSignature() {
    try {
      let tableColumns = this.colsForSignature;
      if (this.isEnabledColumnFilterForSignature) {
        this.toggleFilterTitleForSignature = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForSignature = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

  changeColumnFilterForStack() {
    try {
      let tableColumns = this.colsForStackTrace;
      if (this.isEnabledColumnFilterForStack) {
        this.toggleFilterTitleForStack = 'Show Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = false;
        }
      } else {
        this.toggleFilterTitleForStack = 'Hide Column Filters';
        for (let i = 0; i < tableColumns.length; i++) {
          tableColumns[i].filter = true;
        }
      }
    } catch (error) {
      console.log('Error while Enable/Disabled column filters', error);
    }
  }

}
