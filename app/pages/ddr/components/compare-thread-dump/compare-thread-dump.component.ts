import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { DataTableModule, BlockUIModule, SelectItem } from 'primeng/primeng';
import { CommonServices } from '../../services/common.services';
import { ThreadDumpInfo, ParsedThreadDumpInfo } from '../../interfaces/take-thread-dump-data-info';
import 'rxjs/Rx';
import { ChartModule } from 'angular2-highcharts';
import { CavConfigService } from "../../../../main/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../../main/services/cav-top-panel-navigation.service";
import { DDRRequestService } from '../../services/ddr-request.service';
@Component({
  selector: 'app-compare-thread-dump',
  templateUrl: './compare-thread-dump.component.html',
  styleUrls: ['./compare-thread-dump.component.css']
})
export class CompareThreadDumpComponent implements OnInit {
  ngOnInit() {
   this.commonServices.isToLoadSideBar = false ;  
}
  showChart: boolean = false;
  options: any;
  optionsForCompare: any;
  options1: any;
  optionsForCompare1: any;
  options2: any;
  optionsForCompBarChart: any;
  threadTableHeader: any;
  threadTableHeader1: any;
  fileName: string;
  fileName1; string;
  indiThreadInfo: any;
  indiThreadInfo1: any;
  threadDumpInfo1: any;
  stacktrace: any;
  stacktrace1: any;
  id: any;
  tierList: SelectItem[];
  selectedTiers: string[];
  selectedServers: string[];
  serverList: SelectItem[];
  selectedApps: string[];
  appList: SelectItem[];
  selectedThreadDumpInfo: any;
  showUsedMethodChart:boolean;
  options3: Object;//used for top method count
  options4: Object;
  showThreadTable:boolean=true;
  commonMethods:string;
  threadDumpInfo: Array<ParsedThreadDumpInfo>;
  threadDumpData: [{ "threadId": "", "threadName": "", "priority": "", "threadState": "", "nativeId": "", "stackTrace": "" }];
  //showStackTrace: any;
  analyzeHeader: any;
  analyzeHeader1: any;
  selectedThreadInfo: ParsedThreadDumpInfo;
  selectedThreadInfo1: ParsedThreadDumpInfo;
  showAllOption: boolean = false;
  pieDataArr = [];
  showBarChart: boolean;
  commonMethodArr = [];
  constructor(private http:HttpClient, private commonServices: CommonServices,
    private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService,
    private ddrRequest:DDRRequestService) {
    this.id = commonServices.getData();
    this.getcompareThreadDump();
    this.tierList = [];
    this.tierList.push({ label: this.id.tierName, value: this.id.tierName });
    this.selectedTiers = [];
    this.selectedTiers.push(this.id.tierName);
    this.serverList = [];
    this.serverList.push({ label: this.id.serverName, value: this.id.serverName });
    this.selectedServers = [];
    this.selectedServers.push(this.id.serverName);
    this.appList = [];
    this.appList.push({ label: this.id.appName, value: this.id.appName });
    this.selectedApps = [];
    this.selectedApps.push(this.id.appName);
  }

  /*Method is used get host url*/
  getHostUrl(): string {
    var hostDcName;
    if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
      hostDcName = this._cavConfigService.getINSPrefix();
    else
      hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

    if (hostDcName.length > 0) {
      sessionStorage.removeItem("hostDcName");
      sessionStorage.setItem("hostDcName", hostDcName);
    }
    else
      hostDcName = sessionStorage.getItem("hostDcName");

    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  getcompareThreadDump() {
    console.log('common data-----', this.commonServices.compareThreadDump);
    let compareData = this.commonServices.compareThreadDump;
    console.log('getdata------', compareData)
    if (compareData.length == 2) {
      for (let i = 0; i < compareData.length; i++) {
        let obj = compareData[i];
        console.log('obj---', obj);
        let filePath = obj.filePath;
        if (i === 0) {
          this.fileName = filePath.substring(filePath.lastIndexOf('/')+1);
        }
        if(i === 1) {
          this.fileName1 = filePath.substring(filePath.lastIndexOf('/')+1);
        }
        console.log('filepath', filePath);
        this.getParsedThreadDumpData(filePath);
        this.getcommonMethodCount(filePath)
      }
    }
  }

  /*
  * used to parse Thread dump file
  */
  getParsedThreadDumpData(filePath: any) {
    console.log('filepath-----', filePath);
    let forParseThreadDumpUrl = "//" + this.getHostUrl() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/parseThreadDumpFile?filePath=" + filePath;
    this.ddrRequest.getDataUsingGet(forParseThreadDumpUrl).subscribe(data => {
      this.doAssignValueParseTD(data);
    });
  }

  /*
  *assign value to pieChart object and Analyze Thread Dump
  */
  doAssignValueParseTD(data: any) {
    //console.log(data);
    this.pieDataArr.push(data);
    console.log('dataArray', this.pieDataArr);
    if (this.pieDataArr.length == 2) {
      for (let i = 0; i < 2; i++) {
        let data = this.pieDataArr[i];
        let arrAggTDState = this.convertAggMaptoArr(data.aggregateState);
        console.log('piechart data----', i, arrAggTDState);
        this.createPieChart(arrAggTDState, i);
        
        this.createPieChartForDaemonOrNonDaemon(data.daemonOrNonDaemonCount, i);
        if (i === 0){
          this.threadDumpData = data.data;
          this.threadDumpInfo = this.getThreadDumpInfo(i);
          this.analyzeHeader = "[Total Threads:" + this.threadDumpInfo.length + "]";
          this.threadTableHeader = "[Threads:" + this.threadDumpInfo.length + ",Thread State : All]";
        }
        if (i === 1) {
          this.threadDumpData = data.data;
          this.threadDumpInfo1 = this.getThreadDumpInfo(i);
          this.analyzeHeader1 = "[Total Threads:" + this.threadDumpInfo.length + "]";
          this.threadTableHeader1 = "[Threads:" + this.threadDumpInfo.length + ",Thread State : All]";
        }
        
      }

    }
    // this.threadDumpData = data.data;

    // console.log("threadDUmpDaa-----",this.threadDumpData);
    
    
  }

  getThreadDumpInfo(flag): Array<ParsedThreadDumpInfo> {
    var parsedTDInfo = [];

    this.threadDumpData.forEach((val, index) => {
      if (index == 0)
        this.showStackTrace({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] }, flag);
      parsedTDInfo.push({ "threadId": this.threadDumpData[index]["threadId"], "threadName": this.threadDumpData[index]["threadName"], "priority": this.threadDumpData[index]["priority"], "threadState": this.threadDumpData[index]["threadState"], "nativeId": this.threadDumpData[index]["nativeId"], "stackTrace": this.threadDumpData[index]["stackTrace"] });
    });
    console.log(parsedTDInfo);
    return parsedTDInfo;
  }

  showStackTrace(data, flag) {
    // alertalert(flag);
    if (flag === 0) {
      this.selectedThreadInfo = data;
      this.stacktrace = data.stackTrace
      this.indiThreadInfo = "[Name : " + data.threadName + ",id : " + data.threadId + "]";
    }
    
    if (flag === 1) {
      this.selectedThreadInfo1 = data;
      this.stacktrace1 = data.stackTrace
      this.indiThreadInfo1 = "[Name : " + data.threadName + ",id : " + data.threadId + "]";
    }
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
    console.log(aggTDStateArr);
    return aggTDStateArr;
  }

  createPieChartForDaemonOrNonDaemon(countArr: any[], flag) {
    let TCategoryArr = [];
    TCategoryArr.push({ "name": "Daemon", "y": countArr[0] });
    TCategoryArr.push({ "name": "Non-Daemon", "y": countArr[1] });
    TCategoryArr.push({ "name": "GC", "y": countArr[2] });
    if (flag === 0) {
      this.options1 = {
        chart: {
          type: 'pie',
        },
        credits: {
          enabled: false
        },
        title: { text: '', style: { 'fontSize': '13px' } },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            cursor: 'pointer',
            allowPointSelect: true,
            dataLabels: {
              enabled: true,
              format: '<b> {point.name} </b>: {point.percentage:.2f} %',
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

    if (flag === 1) {
      this.optionsForCompare1 = {
        chart: {
          type: 'pie',
        },
        credits: {
          enabled: false
        },
        title: { text: '', style: { 'fontSize': '13px' } },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            cursor: 'pointer',
            allowPointSelect: true,
            dataLabels: {
              enabled: true,
              format: '<b> {point.name} </b>: {point.percentage:.2f} %',
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
  }

  getcommonMethodCount(filePath: any) {
    let ipWithProd = this.getHostUrl() + '/' + this.id.product;
    let forCommonMethodUrl = "//" + ipWithProd + "/v1/cavisson/netdiagnostics/ddr/getCommonMethods?filePath=" + filePath;
    this.ddrRequest.getDataUsingGet(forCommonMethodUrl).subscribe(data => {
      this.doAssignValueCommonMethod(data);
    });
  }
  doAssignValueCommonMethod(data: any) {
    console.log(data);
    this.commonMethodArr.push(data);
    if (this.commonMethodArr.length === 2) {
      for (let i = 0; i < 2; i++) {
        let data = this.commonMethodArr[i];
        let TDCatgoryArr = this.convertCommonMethodMapToArr(data.commonMethod);
        this.createBarChart(TDCatgoryArr, i);
        let topMethodArr= this.convertTopMethodMapToArr(data.topNMethod);
        this.createTopMethodBarChart(topMethodArr, i);
      }

    }

  }
  createTopMethodBarChart(topMethodArr:any[], flag)
  {
    if(topMethodArr.length >0)
    this.showUsedMethodChart=true;
    else
     this.showUsedMethodChart=false;
    if (flag === 0) {
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
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
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

    if (flag === 1) {
      this.options4 = {
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
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
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
  }
  convertTopMethodMapToArr(data:any):Array<any>
  {
    let topMethodArr=[]
      console.log(data);
      let arr=Object.keys(data);
       arr.forEach((val,index)=>{    
      let topCount=data[val] ;
      if(topCount>1)
      topMethodArr.push({"name":val,"y":topCount});
    });
return topMethodArr;
  }
  
  handleChange(e, flag)
  {
    console.log(e.index);
    if (flag === 0) {
      if(e.index ==2) {
        this.showThreadTable=false;
      } else {
        this.showThreadTable=true;
      }
    }
    if (flag === 1) {
      if(e.index ==2) {
        this.showThreadTable=false;
      } else {
      this.showThreadTable=true;
      }
    }
    
    
    
  }
  convertCommonMethodMapToArr(data:any):Array<any>
  {
    let tDCategoryArr=[];
    let arr=Object.keys(data);
    console.log(arr.length);
    arr.forEach((val,index)=>{
      let oneArr=data[val] ;
      if(index ==0 )
      this.commonMethods=oneArr["commonMethods"].replace(/at/g,'');
      tDCategoryArr.push({"name":oneArr["commonMethods"],"y":oneArr["matchCount"]});
    });
    if(tDCategoryArr.length == 0)
     this.commonMethods="";
      return tDCategoryArr;
  }
  createBarChart(TDCatgoryArr: any, flag) {
    console.log('barchart flag', flag, 'data', TDCatgoryArr);
    if (TDCatgoryArr.length > 0)
      this.showBarChart = true;
    else
      this.showBarChart = false;
    if (flag === 0) {
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
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [
          {
            name: '',
            enableMouseTracking: true,
            data: TDCatgoryArr
          }]
      }
    }
    if (flag === 1) {
      this.optionsForCompBarChart = {
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
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [
          {
            name: '',
            enableMouseTracking: true,
            data: TDCatgoryArr
          }]
      }
    }
  }
  /*
  * used to show piechart on basis of state
  */
  createPieChart(arrAggTDState: any[], flag) {
    console.log('flag-----', flag, 'data--', arrAggTDState);

    if (arrAggTDState.length == 0) {
      this.showChart = false;
    }
    else {
      this.showChart = true;
    }
    if (flag === 0) {
      this.options = {
        chart: {
          type: 'pie',
        },
        credits: {
          enabled: false
        },
        title: { text: '', style: { 'fontSize': '13px' } },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                console.log('events...', event);
                this.clickHandler(event, flag);
              }.bind(this)
            },
          }
        },
        series: [
          {
            name: 'Percentage',
            enableMouseTracking: true,
            data: arrAggTDState
          }
        ]
      };
    }

    if (flag === 1) {
      this.optionsForCompare = {
        chart: {
          type: 'pie',
        },
        credits: {
          enabled: false
        },
        title: { text: '', style: { 'fontSize': '13px' } },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
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
                console.log('events...', event);
                this.clickHandler1(event, flag);
              }.bind(this)
            },
          }
        },
        series: [
          {
            name: 'Percentage',
            enableMouseTracking: true,
            data: arrAggTDState
          }
        ]
      };
    }
    //  console.log(this.options);
  }

  /*
  *
  * */
  clickHandler(event, flag) {
    console.log('event name-----', event);
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
    if (filterType == "State") {
      this.threadTableHeader = "[Total Threads :" + filteredTDInfo.length + ", Thread State : " + event.point.name + "]";
    }
    //console.log(filteredTDInfo.length);
    if (filteredTDInfo.length > 0) {
      this.showStackTrace(filteredTDInfo[0], flag);
    }
    this.threadDumpInfo = filteredTDInfo;  
       
  }
   /*
  *
  * */
  clickHandler1(event, flag) {
    console.log('event name-----', event);
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
    if (filterType == "State") {
      this.threadTableHeader1 = "[Total Threads :" + filteredTDInfo.length + ", Thread State : " + event.point.name + "]";
    }
    //console.log(filteredTDInfo.length);
    if (filteredTDInfo.length > 0) {
      this.showStackTrace(filteredTDInfo[0], flag);
    }
    this.threadDumpInfo1 = filteredTDInfo;  
       
  }
}
