import { Component, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockUIModule, SelectItem, MenuItem } from 'primeng';
import { CommonServices } from '../service/common.services';
import { ThreadDumpInfo, ParsedThreadDumpInfo, InstanceInterface } from '../interfaces/take-thread-dump-data-info';
import 'rxjs';
// import { ChartModule } from 'angular2-highcharts';
// import { CavConfigService } from "../../services/cav-config.service";
// import { CavTopPanelNavigationService } from "..services/cav-top-panel-navigation.service";
import { DdrDataModelService } from "../service/ddr-data-model.service";
import { Subscription } from "rxjs";
import { DDRRequestService } from '../service/ddr-request.service';
import * as Highcharts from 'highcharts';
import { SessionService } from 'src/app/core/session/session.service';


@Component({
  selector: 'app-analyze-thread-dump',
  templateUrl: './analyze-thread-dump.component.html',
  styleUrls: ['./analyze-thread-dump.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AnalyzeThreadDumpComponent {
  tabs = [
    { label: 'State', routerLink: 'state' },
    { label: 'Category', routerLink: 'category' },
    { label: 'Common Methods', routerLink: 'common-methods' },
    { label: 'Most Used Methods', routerLink: 'most-used-methods' },
    { label: 'Thread Groups', routerLink: 'thread-groups' },
    { label: 'Deadlocks', routerLink: 'deadlocks' },
    { label: 'Hotstacks', routerLink: 'hotstacks' },
  ];
  id: any;
  threadDumpData: [{ "threadId": "", "threadName": "", "priority": "", "threadState": "", "nativeId": "", "stackTrace": "" }];
  property: string;
  analyseThreadDump: boolean = true;
  loading: boolean = false;
  options: Object;//this is used to handle thread dump state pie chart
  showChart: boolean = false;
  threadDumpInfo: Array<ParsedThreadDumpInfo>;
  stacktrace: string;
  selectedThreadInfo: ParsedThreadDumpInfo;
  indiThreadInfo: string;
  analyzeHeader: string;
  threadTableHeader: string;
  showAllOption: boolean = false;
  options2: Object;// used for bar chart for common methods
  showBarChart: boolean;
  showDownLoadReportIcon: boolean = true;
  options1: Object;//Used for daemon and Non daemon threads
  showUsedMethodChart: boolean;
  options3: Object;//used for top method count
  showThreadTable:number = 0;
  commonMethods: string;
  selectedRowIndex: number = 0;
  hotstack:string;
  fileName: any;
  showThreadGroup: boolean = false;
  options4: Object;//used for thread group count
  deadlockMsg: string = "";
  isDeadlock: boolean = false;
  deadlockthreadName: string;
  showHotstack:boolean =false;
  options5:Object;//used for hot stack count
  hotstackCount:string;
  hotstackCompareCount:number=3;
  fullFileName:string;
  otherArr=[];
  dcinfo: any;
  dcTestRun: any;
  highcharts = Highcharts;
  constructor(private sessionService: SessionService, private commonServices: CommonServices, private _ddrData: DdrDataModelService,private ddrRequest:DDRRequestService) {
      this.loading = true;
   // this.id = commonServices.getData();
  //  console.log('id-----------', this.id)
      // this.productName = this.sessionService.session.cctx.prodType;
     }

  @Input('value') value;
  @Input('productName') productName;
  @Input('dcInfo') dcInfo;

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.fileName = this.value.filePath.substring(this.value.filePath.lastIndexOf('/')+1);
    this.fullFileName=this.value.filePath;
    this.hotstackCompareCount=3;
   // console.log('exact data------------', changes.value.currentValue);
    this.showAnalysisThreadDump(changes);
    let log: string[] = [];
    
    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      console.log('changes in dat----------', to);
    }
    
  }

  /*Method is used get host url*/
  getHostUrl(dcName?): string {
    var hostDcName;
    // if(dcName && this.dcInfo)
    // {
      //let dcObject = this.dcInfo.find((dcObj) => { return dcObj.dc == dcName; });
      // hostDcName = location.protocol + "//" + location.host + "/tomcat/" + dcName;
      //hostDcName =  dcObject.protocol+"://" + dcObject.ip + ":" + dcObject.port;
    // }
    // else if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // else
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem("hostDcName");
    //   sessionStorage.setItem("hostDcName", hostDcName);
    // }
    // else
    hostDcName = window.location.protocol + '//' + window.location.host;

    console.log('hostDcName =', hostDcName, this.productName);
    return hostDcName;
  }

  showAnalysisThreadDump(changes: any) {
    console.log('analyse data----inside show',this.value);
    console.log('exact data in side show------------', changes.value.currentValue);
    let filePath = this.value.filePath;
    let sunstringFilePath = filePath.substring(filePath.indexOf("logs"), filePath.length);
    let ipWithProd = this.getHostUrl(this.value.dcName) + '/' + this.productName;
    let downloadfilPath =  ipWithProd.replace("/netstorm", "").replace("/netdiagnostics", "") + "/" + sunstringFilePath;
    console.log('downloadfilepath===========', downloadfilPath)
    this.ddrRequest.getDataInStringUsingGet(downloadfilPath).subscribe(data => {
      this.assignThreadDump(data)
    },
    error => {
      console.log("File not found or having some other issue ",filePath);
    });
    this.getParsedThreadDumpData(filePath);
    this.getcommonMethodCount(filePath)
  }

  getcommonMethodCount(filePath: any) {
    let ipWithProd = this.getHostUrl(this.value.dcName) + '/' + this.productName;
    let forCommonMethodUrl =  ipWithProd + "/v1/cavisson/netdiagnostics/ddr/getCommonMethods?filePath=" + filePath;
    this.ddrRequest.getDataUsingGet(forCommonMethodUrl).subscribe(data => {
      this.doAssignValueCommonMethod(data);
    },
    error => {
      console.log("getcommonMethodCount | File Not Found ");
    });
  }
  doAssignValueCommonMethod(data: any) {
    //console.log(data);
    let TDCatgoryArr = this.convertCommonMethodMapToArr(data.commonMethod);
    this.createBarChart(TDCatgoryArr);
    let topMethodArr = this.convertTopMethodMapToArr(data.topNMethod);
    this.createTopMethodBarChart(topMethodArr);
    let hotStackArr=this.convertHotStackMapToArr(data.hotstack);
    this.createHotStackBarChart(hotStackArr);
  }
  showThreadTableMethod()
  {
    console.log(this.hotstack);
  }
  createHotStackBarChart(hotStackArr:any[])
  {
    if(hotStackArr.length> 0)
    {
    this.showHotstack=true;
    this.hotstackCount=""+hotStackArr.length+"";
    }
    else
    this.showHotstack=false;
      this.options5 = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        title: {
          text: 'Hotstack'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Hotstack Count'
        }
      },
     tooltip: {
         style: {fontSize: '7pt'},
    formatter: function() {
      let splittedCM=this.point.name.split("\n");
      let tooltip="";
      splittedCM.forEach((val,index)=>{
          tooltip+=""+val+"<br/>";
      });
      tooltip+="<b>"+this.point.y+"</b>";
        return tooltip;
    }
},
      plotOptions: {
        column: {
          cursor: 'pointer',
          allowPointSelect: true,
          events: {
            click: function (event) {
             // this.filterTopMethod(event);
              this.assignHotStack(event);
            }.bind(this)
          },
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
         series: {
            pointWidth: 25
        }
      },
      series: [{
        showInLegend: false,
        enableMouseTracking: true,
        name: '',
        data: hotStackArr
      }]
    }
  }
  convertHotStackMapToArr(hotStackMap:any):any[]
{
   let hotStackArr = []
    let arr = Object.keys(hotStackMap);
    arr.forEach((val, index) => {
      let hotStackCount = hotStackMap[val];
        if(index == 0)
        this.hotstack = val.replace(/at /g, '');
      if (hotStackCount > 1)
        hotStackArr.push({ "name": val, "y": hotStackCount });
    });
     if (hotStackArr.length == 0)
      this.hotstack = "";
   // return topMethodArr;
   return hotStackArr;
}
  handleChange(e) {
    // console.log(e.index);
    if (e.index == 2 )
      this.showThreadTable = 1;
    else if( e.index== 6)
      this.showThreadTable = 2;
    else if( e.index== 5)
    {
         if(!this.isDeadlock)
         this.threadDumpInfo=[];
         this.indiThreadInfo="";
         this.stacktrace="";
    }
    else
    {
      this.showThreadTable = 0;
      this.threadDumpInfo = this.getThreadDumpInfo();
    }
    this.showAllThreadData();

  }

  convertCommonMethodMapToArr(data: any): Array<any> {
    let tDCategoryArr = [];
    let arr = Object.keys(data);
    // console.log(arr.length);
    arr.forEach((val, index) => {
      let oneArr = data[val];
      if (index == 0)
        this.commonMethods = oneArr["commonMethods"].replace(/at /g, '');
      tDCategoryArr.push({ "name": oneArr["commonMethods"], "y": oneArr["matchCount"] });
    });
    if (tDCategoryArr.length == 0)
      this.commonMethods = "";
    return tDCategoryArr;
  }


  createTopMethodBarChart(topMethodArr: any[]) {
    if (topMethodArr.length > 0)
      this.showUsedMethodChart = true;
    else
      this.showUsedMethodChart = false;
    this.options3 = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        title: {
          text: 'Top Used Methods'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Thread Count'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          cursor: 'pointer',
          allowPointSelect: true,
          events: {
            click: function (event) {
              this.filterTopMethod(event);
            }.bind(this)
          },
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
         series: {
            pointWidth: 25
        }
      },
      series: [{
        showInLegend: false,
        enableMouseTracking: true,
        name: '',
        data: topMethodArr
      }]
    }
  }
  filterThreadGroup(event) {
    let filteredTDInfo = [];
    // console.log(event.point.name);
   // console.log("otherArra",this.otherArr);
    let otherArr=this.otherArr;
    this.threadDumpData.forEach((val, index) => {
      let threadInfo = val;
      // console.log(threadInfo["threadName"].startsWith(event.point.name));
     // console.log("thread name",threadInfo["threadName"]);
     // console.log(otherArr.indexOf(threadInfo["threadName"]));
    //console.log(otherArr.filter((x)=>threadInfo["threadName"].startsWith(x)));
      if(event.point.name == "Others" && otherArr.filter((x)=>threadInfo["threadName"].startsWith(x)).length == 1)
      {
         filteredTDInfo.push({ "threadId": threadInfo["threadId"], "threadName": threadInfo["threadName"], "priority": threadInfo["priority"], "threadState": threadInfo["threadState"], "nativeId": threadInfo["nativeId"], "stackTrace": threadInfo["stackTrace"] });
      }
      else if (threadInfo["threadName"].startsWith(event.point.name)) {
        filteredTDInfo.push({ "threadId": threadInfo["threadId"], "threadName": threadInfo["threadName"], "priority": threadInfo["priority"], "threadState": threadInfo["threadState"], "nativeId": threadInfo["nativeId"], "stackTrace": threadInfo["stackTrace"] });
      }
    });
    // console.log(filteredTDInfo.length);
    if (filteredTDInfo.length > 0) {
      this.showStackTrace(filteredTDInfo[0]);
      this.threadTableHeader = " [Threads:" + filteredTDInfo.length + "]";
    }
    this.showAllOption = true;
    this.threadDumpInfo = filteredTDInfo;
  }
  filterTopMethod(event) {
    let filteredTDInfo = [];
    this.threadDumpData.forEach((val, index) => {
      let threadInfo = val;
      if (threadInfo["stackTrace"].indexOf(event.point.name) != -1) {
        filteredTDInfo.push({ "threadId": threadInfo["threadId"], "threadName": threadInfo["threadName"], "priority": threadInfo["priority"], "threadState": threadInfo["threadState"], "nativeId": threadInfo["nativeId"], "stackTrace": threadInfo["stackTrace"] });
      }
    });
    if (filteredTDInfo.length > 0) {

      this.showStackTrace(filteredTDInfo[0]);
      this.threadTableHeader = " [Threads:" + filteredTDInfo.length + "]";
    }
    this.showAllOption = true;
    this.threadDumpInfo = filteredTDInfo;
  }
  convertTopMethodMapToArr(data: any): Array<any> {
    let topMethodArr = []
    let arr = Object.keys(data);
    arr.forEach((val, index) => {
      let topCount = data[val];
      if (topCount > 1)
        topMethodArr.push({ "name": val, "y": topCount });
    });
    return topMethodArr;
  }
  /*
  * BarChart to show Common Methods
  */
  createBarChart(TDCatgoryArr: any) {
    if (TDCatgoryArr.length > 0)
      this.showBarChart = true;
    else
      this.showBarChart = false;
    this.options2 = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        title: {
          text: 'Common Methods'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Count'
        }
      },
      tooltip: {
         style: {fontSize: '7pt'},
    formatter: function() {
      let splittedCM=this.point.name.split("\n");
      let tooltip="";
      splittedCM.forEach((val,index)=>{
          tooltip+=""+val+"<br/>";
      });
      tooltip+="<b>"+this.point.y+"</b>";
        return tooltip;
    }
},
   /*   tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },*/
      plotOptions: {
        column: {
          cursor: 'pointer',
          allowPointSelect: true,
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          },
          events: {
            click: function (event) {

              this.assignCommonMethod(event);
            }.bind(this)
          }
        },
         series: {
            pointWidth: 25
        }
      },
      series: [
        {
          showInLegend: false,
          enableMouseTracking: true,
          name: '',
          data: TDCatgoryArr
        }]
    }

  }
  /*
    * used to parse Thread dump file
    */
  getParsedThreadDumpData(filePath: any) {
    let forParseThreadDumpUrl =  this.getHostUrl(this.value.dcName) + '/' + this.productName + "/v1/cavisson/netdiagnostics/ddr/parseThreadDumpFile?filePath=" + filePath;
    this.ddrRequest.getDataUsingGet(forParseThreadDumpUrl).subscribe(data => {
      this.doAssignValueParseTD(data, filePath);
    },
    error => {
      console.log("File not found ",filePath);
    });
  }
  assignCommonMethod(event: any) {
    this.commonMethods = event.point.name.replace(/at /g, '');
  }
   assignHotStack(event: any) {
    this.hotstack = event.point.name.replace(/at /g, '');
  }

  /*
   *assign value to pieChart object and Analyze Thread Dump
   */
  doAssignValueParseTD(data: any, filePath: string) {
    //console.log(data);
    let arrAggTDState = this.convertAggMaptoArr(data.aggregateState);
    this.createPieChart(arrAggTDState);
    this.threadDumpData = data.data;
    let deadlockMessage = data.adlockMessage;
    if (deadlockMessage.length > 0) {
      this.deadlockMsg = deadlockMessage;
      this.isDeadlock = true;
    }
    else {
      this.deadlockMsg = "No deadlock found";
      this.isDeadlock = false;
    }
    this.deadlockthreadName = data.deadloackThreadList;
    this.createPieChartForDaemonOrNonDaemon(data.daemonOrNonDaemonCount);
    let threadGroupArr = this.convertThreadGroupMapToArr(data.threadGroup);
    this.createPieChartForThreadGroup(threadGroupArr);
    this.threadDumpInfo = this.getThreadDumpInfo();
    let FilePath = filePath.substring(filePath.lastIndexOf('/') + 1);
    this.analyzeHeader = "[Total Threads:" + this.threadDumpInfo.length + ", File:" + FilePath + "]";
    this.threadTableHeader = "[Threads:" + this.threadDumpInfo.length + ",Thread State : All]";
  }
  convertThreadGroupMapToArr(threadGroupMap: any): any[] {
    var threadGroupArr = [];
    let otherArr=[];
    let otherCount=0;
    for (let prop in threadGroupMap) {
      if (threadGroupMap.hasOwnProperty(prop) && threadGroupMap[prop] > 1) {
        threadGroupArr.push({ "name": prop, "y": threadGroupMap[prop] });
      }
      else
      {
        otherCount++;
         otherArr.push(prop);
      }

    }
     threadGroupArr.push({ "name": "Others", "y": otherCount });
    this.otherArr=otherArr;
    return threadGroupArr;
  }
  showDeadlockThreads() {
    let parsedTDInfo = []
    this.threadDumpData.forEach((val, index) => {
      if (this.deadlockthreadName.indexOf("\"" + val['threadName'] + "\"") != -1)
        parsedTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
    });
    if (parsedTDInfo.length > 0) {
      this.threadTableHeader = " [Threads:" + parsedTDInfo.length + "]";
      this.showStackTrace(parsedTDInfo[0]);
    }
    this.showAllOption = true;
    this.threadDumpInfo = parsedTDInfo
  }
  createPieChartForThreadGroup(threadGroupArr: any[]) {
    if (threadGroupArr.length > 0)
      this.showThreadGroup = true;
    else
      this.showThreadGroup = false;
    this.options4 = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: '', style: { 'fontSize': '13px' } },
      tooltip: {
        pointFormat: ' Count: <b>{point.y}</b><br/> Percenatge: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
          events: {
            click: function (event) {
              this.filterThreadGroup(event);
            }.bind(this)
          },
        }
      },
      series: [
        {
          name: '',
          enableMouseTracking: true,
          data: threadGroupArr
        }
      ]
    };
  }
  createPieChartForDaemonOrNonDaemon(countArr: any[]) {
    let TCategoryArr = [];
    if(countArr[0] > 0 )
    TCategoryArr.push({ "name": "Daemon", "y": countArr[0] });
     if(countArr[1] > 0 )
    TCategoryArr.push({ "name": "Non-Daemon", "y": countArr[1] });
     if(countArr[2] > 0 )
    TCategoryArr.push({ "name": "GC", "y": countArr[2] });
    this.options1 = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: '', style: { 'fontSize': '13px' } },
      tooltip: {
        pointFormat: 'Count:<b>{point.y}</b><br/>{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
          events: {
            click: function (event) {
              this.clickHandler(event);
            }.bind(this)
          },
        }
      },
      series: [
        {
          name: 'Percentage',
          enableMouseTracking: true,
          data: TCategoryArr
        }
      ]
    };
  }

  /*
  **/
  getThreadDumpInfo(): Array<ParsedThreadDumpInfo> {
    var parsedTDInfo = [];
    if(this.threadDumpData){
      this.threadDumpData.forEach((val, index) => {
        if (index == 0)
        this.showStackTrace({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
        parsedTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
      });
    }
    return parsedTDInfo;
  }
  /*
  *convert map to arr
  */
  convertAggMaptoArr(aggregateMap: any): any[] {
    var aggTDStateArr = [];
    for (let prop in aggregateMap) {
      if (aggregateMap.hasOwnProperty(prop)) {
        aggTDStateArr.push({ "name": prop, "y": aggregateMap[prop] });
      }

    }
    // console.log(aggTDStateArr);
    return aggTDStateArr;
  }
  /*
  * Changing Stack Trace and Thread Table on click of PieCHart
  * */
  clickHandler(event) {
    // console.log('event name-----', event.point.name);
    this.showAllOption = true;
    let filterType = "";
    let filteredTDInfo = [];
    this.threadDumpData.forEach((val, index) => {
      // console.log(this.threadDumpData[index]["stackTrace"].indexOf(event.point.name));
      if ((this.threadDumpData[index]["threadState"] == event.point.name)) {
        filterType = "State";
        filteredTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
      }
      else if (event.point.name == "Daemon" && (this.threadDumpData[index]["stackTrace"].indexOf("daemon") != -1)) {
        filterType = "Category";
        filteredTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
      }
      else if (event.point.name == "GC" && (this.threadDumpData[index]["stackTrace"].indexOf("GC") != -1)) {
        filterType = "Category";
        filteredTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
      }
      else if (event.point.name == "Non-Daemon" && (this.threadDumpData[index]["stackTrace"].indexOf("daemon") == -1) && (this.threadDumpData[index]["stackTrace"].indexOf("ParallelGC") == -1)) {
        filterType = "Category";
        filteredTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
      }
    });
    if (filterType == "State")
      this.threadTableHeader = "[Total Threads :" + filteredTDInfo.length + ", Thread State : " + event.point.name + "]";
    else if (filterType == "Category")
      this.threadTableHeader = "[Total Threads :" + filteredTDInfo.length + ", Thread Category : " + event.point.name + "]";

    //console.log(filteredTDInfo.length);
    if (filteredTDInfo.length > 0)
      this.showStackTrace(filteredTDInfo[0]);
    this.threadDumpInfo = filteredTDInfo;
  }
  showStackTrace(data) {
    this.selectedThreadInfo = data;
    this.stacktrace = data.stackTrace
    this.indiThreadInfo = "[Name : " + data.threadName + ",id : " + data.threadId + "]";
  }
  showAllThreadData() {
    this.threadDumpInfo = this.getThreadDumpInfo();
    this.threadTableHeader = "[Total Threads :" + this.threadDumpInfo.length + ", Thread State : All]";
    this.showAllOption = false;
  }
  /*
    * used to show piechart on basis of state
    */
  createPieChart(arrAggTDState: any[]) {
    if (arrAggTDState.length == 0) {
      this.showChart = false;
    }
    else {
      this.showChart = true;
    }
    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: '', style: { 'fontSize': '13px' } },
      tooltip: {
        pointFormat: 'Count:<b> {point.y}</b><br/>{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name}  </b>: {point.percentage:.2f} %',
          },
          events: {
            click: function (event) {
              //   console.log('events...', event);
              this.clickHandler(event);
            }.bind(this)
          },
        }
      },
      series: [
        {
          enableMouseTracking: true,
          name: 'Percentage',
          data: arrAggTDState
        }
      ]
    };
    //  console.log(this.options);
  }
   getTopFramedHotstack()
   {
     console.log(this.hotstackCompareCount);
      let ipWithProd = this.getHostUrl(this.value.dcName) + '/' + this.productName;
    let hostack_url =  ipWithProd + "/v1/cavisson/netdiagnostics/ddr/getHotstackBasedTopFrames?filePath=" +  this.fullFileName+"&topFrames="+this.hotstackCompareCount;
    this.ddrRequest.getDataUsingGet(hostack_url).subscribe(data =>{
          let hotStackArr=this.convertHotStackMapToArr(data['hotstack']);
          this.createHotStackBarChart(hotStackArr);
     });
   }
  assignThreadDump(data: string) {
    this.property = data;
  }
  /*
  **
  */
  // SortOnCustom(event, tempData) {
  //    let fieldValue = event["field"];
  //    if (fieldValue == "priority" ) {
  //     if (event.order == -1) {
  //       event.order = 1
  //       tempData = tempData.sort(function (a, b) {
  //         var value = parseInt(a[fieldValue]);
  //         console.log("value is"+ value);
  //         var value2 = parseInt(b[fieldValue]);
  //         console.log("value2 is"+ value2);
  //          if( isNaN(value) || isNaN(value2) ){
  //            if(isNaN(value) == isNaN(value2))
  //            return(0);
  //            else if(isNaN(value) == !isNaN(value2))
  //            return(1);
  //            else 
  //            return(-1);
  //          }else
  //         return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //       });
  //     }
  //     else {
  //       event.order = -1;
  //       //asecding order
  //       tempData = tempData.sort(function (a, b) {
  //         var value = parseInt(a[fieldValue]);
  //         console.log("value is"+ value);
  //         var value2 = parseInt(b[fieldValue]);
  //         console.log("value2 is"+ value2);
  //         if( isNaN(value) || isNaN(value2)){
  //           if(isNaN(value) == isNaN(value2))
  //           return(0);
  //           else if(isNaN(value) && !isNaN(value2))
  //           return(-1);
  //           else
  //           return(1);
  //         } else
  //         return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
  //       });
  //     }
  //   }else if(event["field"] == "threadId" || event["field"] ==  "nativeId" ) {
  //           if (event.order == -1) {
  //             var temp = (event["field"]);
  //             event.order = 1
  //             var reA = /[^a-zA-Z]/g;
  //             var reN = /[^0-9]/g;
  //             tempData = tempData.sort(function (a, b) {
  //               var v1 = a[temp];
  //               var v2 = b[temp];
  //               let value;
  //               let value2;
  //               v1 = v1.replace(reA, "");
  //               v2 = v2.replace(reA, "");
  //               console.log('v1=======',v1);
  //               if(v1 === v2)
  //               {
  //                 value = parseInt(a[temp].replace(reN, ""), 10);
  //                 value2 = parseInt(b[temp].replace(reN, ""), 10);
  //                 console.log("value1 isssss  " + value);
  //                 console.log("value2 isssss  " + value2);
  //                 return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //               }else {
  //                 value = a[temp];
  //                 value2 = b[temp];
  //                 console.log("else case value1 isssss  " + value);
  //                 console.log("value2 isssss  " + value2);
  //                 return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);            
  //               }
  //             });
  //           }else {
  //             var temp = (event["field"]);
  //             event.order = -1
  //             var reA = /[^a-zA-Z]/g;
  //             var reN = /[^0-9]/g;
  //             tempData = tempData.sort(function (a, b) {
  //               let v1 = a[temp];
  //               let v2 = b[temp];
  //               let value;
  //               let value2;
  //               v1 = v1.replace(reA, "");
  //               v2 = v2.replace(reA, "");
  //               if(v1 === v2)
  //               {
  //                 value = parseInt(a[temp].toString().replace(reN, ""), 10);
  //                 value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
  //                 return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
  //               }else {
  //                 value = a[temp];
  //                 value2 = b[temp];
  //                 return (value > value2) ? 1 : ((value < value2) ? -1 : 0);            
  //               }
  //             });
  //           }
  //         }
  //         else {
  //           if (event.order == -1) {
  //             var temp = (event["field"]);
  //             event.order = 1
  //             tempData = tempData.sort(function (a, b) {
  //               var value = Number(a[temp].replace(/,/g,''));
  //               var value2 = Number(b[temp].replace(/,/g,''));
  //               return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
  //             });
  //           }
  //           else {
  //             var temp = (event["field"]);
  //             event.order = -1;
  //             //asecding order
  //             tempData = tempData.sort(function (a, b) {
  //               var value = Number(a[temp].replace(/,/g,''));
  //               var value2 = Number(b[temp].replace(/,/g,''));
  //               return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
           
  //       });
  //     }
  //   }
  //   this.threadDumpInfo = [];
  //   if (tempData) {
  //     tempData.map((rowdata) => { this.threadDumpInfo = this.Immutablepush(this.threadDumpInfo, rowdata) });
  //   }
  // }
  sortColumnsOnCustom(event) {
    //console.log("Inside sorting method ===", event);
    //for integer type data type
    if (event["field"] === "priority") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = (event["field"]);
        event.order = -1;
        //ascending order
        event.data = event.data.sort(function (a, b) {
          var value = Number(a[temp]);
          var value2 = Number(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else {
      var temp = (event["field"]);
      if (event.order == -1) {
        event.data = event.data.sort(function (a, b) {
          var value = a[temp];
          var value2 = b[temp];
          return value.localeCompare(value2);
        });
      } else {
        event.order = -1;
        event.data = event.data.sort(function (a, b) {
          var value = a[temp];
          var value2 = b[temp];
          return value2.localeCompare(value);
        });
      }
    }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

   downloadReport(downloadType: string) {
    let threadDetailsRenameArray = { "threadName": "Thread Name", "priority": "Thread Priority", "threadState": "State", "threadId": "Thread ID", "nativeId": "Native ID" ,"stackTrace": "Stack Trace" };
    let threadDetailsColorder = ["Thread Name", "Thread Priority", "State", "Thread ID", "Native ID" , "Stack Trace"];

    this.threadDumpInfo.forEach((val, index) => {
      delete val['_$visited'];
      // delete val['stackTrace'];
        });

    // console.log("threaddetail data is============ ", JSON.stringify(this.threadDumpInfo));
    let downloadObj: Object = {
      downloadType: downloadType,
      strSrcFileName: "ThreadDumpAdvanceReport",
      strRptTitle: "Thread Dump Analyzer",
      jsonData: JSON.stringify(this.threadDumpInfo),
       renameArray:JSON.stringify(threadDetailsRenameArray),
       varFilterCriteria: this.threadTableHeader,
      colOrder: threadDetailsColorder.toString()
    }
    let ipWithProd ="";
    // if(sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == "ALL"){
    if(sessionStorage.getItem("isMultiDCMode")=="true" ){
       ipWithProd = this.getHostUrl("ALL") + '/' + this.productName;
    }else{
       ipWithProd = this.getHostUrl(this.value.dcName) + '/' + this.productName;
    }
    if(ipWithProd.includes("/tomcat"))
    {
      ipWithProd=ipWithProd.replace("/tomcat","/node");
    }
    console.log("tgis.value.dcName",this.value.dcName)
    console.log("ipwithprod---",ipWithProd)
    let downloadFileUrl =  decodeURIComponent(ipWithProd) + "/v1/cavisson/netdiagnostics/ddr/downloadAngularReport";
    // alert("downloadFileUrl---"+downloadFileUrl);
    if(sessionStorage.getItem("isMultiDCMode")=="true")                //&& this._cavConfigService.getActiveDC() !== "ALL"
    {    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl,(downloadObj)).subscribe(res => (
         this.checkDownloadType(res) 
      ));
    }
        else
        {
          this.ddrRequest.getDataInStringUsingPost(downloadFileUrl,JSON.stringify(downloadObj)).subscribe(res => (
             this.openDownloadReports(res,this.value.dcName)));
              
        } 
    }
  checkDownloadType(res:any) {
    res = JSON.parse(res);
    console.log('string to obj',res);
    let dcinfo;
      dcinfo = res.dcInfo;
      console.log("single case checkdownloadType",dcinfo);
    let keys = Object.keys(dcinfo);
    for (let i = 0; i < keys.length; i++) {
      if (dcinfo[keys[i]].isMaster == true) {
        console.log("keyss valueeee==>", dcinfo[keys[i]], " res", res);
        this.openDownloadReports(res, dcinfo[keys[i]].dc)
      }
    }
    // if (res.dcInfo && this._cavConfigService.getActiveDC() !== "ALL")
    // { 
    //   console.log("lalala");
    //   this.openDownloadReports(res, this._cavConfigService.getActiveDC())
    // }
    // else
    //  {
    //    this.openDownloadReports(res, this.value.dcName)
    // } 
  }
  openDownloadReports(res:any,dcName?) {
    let ipWithProd;
    if(dcName)
      ipWithProd = this.getURLbasedOnDC(dcName,res.dcInfo);//single mai res.info ok.
    else
      ipWithProd = this.getHostUrl();
   console.log("file name generate ===",res)
   let fileName;
   if(res.tierData)
   {
     fileName= res.tierData;
     console.log("new res===",fileName);
   }
   else
    fileName = res;
   console.log("ipwithprod========",ipWithProd);
   console.log("product name--" ,this.productName)
   window.open(decodeURIComponent(ipWithProd + '/' + this.productName).replace("/netstorm", "").replace("/netdiagnostics", "") + "/common/" + fileName);
 }
  getURLbasedOnDC(dcName,dcInfo?) {
    let dcinfo;
    if(dcInfo) 
      dcinfo = dcInfo;
    else
      dcinfo = this.dcInfo;

    let dcObject = dcinfo.find((dcObj) => { return dcObj.dc == dcName; });
    this.dcTestRun = dcObject.testRun;
    return dcObject.protocol + "://" +dcObject.ip+":"+dcObject.port;
    
  }
  
}
