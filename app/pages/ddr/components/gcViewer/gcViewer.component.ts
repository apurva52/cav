import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../../services/common.services'
import { Router } from '@angular/router'
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import { jvmMemory } from '../../interfaces/gcViewer';
import { collectionPhaseData } from '../../interfaces/collectionPhaseStatsData'
import { CavConfigService } from '../../../../main/services/cav-config.service';
import { DdrDataModelService } from "../../../../main/services/ddr-data-model.service";
import { causeWiseDataType } from '../../interfaces/gcViewer';
import { Message } from 'primeng/primeng';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';

@Component({
   selector: 'app-gcViewer',
   templateUrl: './gcViewer.component.html',
   styleUrls: ['./gcViewer.component.css']
})

export class GcViewerComponent implements OnInit {

   jvmMemoryData: any[];
   uploadUrl: any;
   uploadedFiles: any[] = [];
   showChart: boolean  = true;


   cols: any[] = [
      { field: 'name', header: '' },
      { field: 'totalTime', header: 'totalTime(sec)' },
      { field: 'avgTime', header: 'avgTime(sec)' },
      { field: 'stdDevTime', header: 'stdDevTime(sec)' },
      { field: 'minTime', header: 'minTime(sec)' },
      { field: 'maxTime', header: 'maxTime(sec)' },
      { field: 'count', header: 'count' },
   ];

   cols2: any[] = [
      { field: 'msg', header: 'GC Type', sortable: true  },
      { field: 'count', header: 'Count', sortable: true },
      { field: 'avg', header: 'Avg Time(sec)', sortable: 'custom' },
      { field: 'min', header: 'Min Time(sec)', sortable: 'custom' },
      { field: 'max', header: 'Max Time(sec)', sortable: 'custom'},
      { field: 'sum', header: 'Total Time(sec)', sortable: 'custom' }

   ];
   colsTime: any[] = [
      { field: 'count', header: 'Count'},
      { field: 'avg', header: 'Avg Time(sec)'},
      { field: 'min', header: 'Min Time(sec)'},
      { field: 'max', header: 'Max Time(sec)' },
      { field: 'sum', header: 'Total Time(sec)' }

   ];
   // colsJVM: any[] = [
   //    { field: 'msg', header: 'Generation'},
   //    { field: 'value', header: 'Allocated (mb)'},
   //    { field: 'peak', header: 'Peak (mb)'},

   // ];
   tooltipAllocated ="Indicates the allocated size for each generation. This data point is gathered from the GC log, thus It may or may not match with the size that is specified by the JVM system properties (i.e. Xmx, -Xms). Say you have configured total heap size (i.e. Xmx) as 2gb, whereas at runtime if JVM has allocated only 1gb, then in this report you are going to see the allocated size as 1gb only.";
   tooltipPeak = "Peak memory utilization of each generation. Typically it won't exceed the allocated size. However in few cases, we have seen peak utilization go beyond allocated size as well, especially in G1 GC.";

   chData = [];
   barData = [];
   barDataName = [];
   url: any;
   commonParams: any;
   id: any;
   arrCase: [];
   causewiseData: [];
   csvData: [];
   summaryData: [];
   calculateData: [];
   causewiseDataSplitted: any[];
   calculateDataSplitted: any[];
   csvDataSplitted: any[];
   summaryDataSplitted: any[];
   csvLineData: any[];
   decimalFormattedCauseWiseData: any[];
   avgThroughPut: any;
   latency: any[];
   pauseTime: any[];
   concTime: any[];
   pauseCon_chData: any[];
   pause_barData: any[];
   concurrent_barData: any[];
   loading = false;
   comeOn = false;
   avgPauseTime: any;
   maxPauseTime:any;
   commandLineFlagData:any;
   //public _message: Message[] = [];
   public _message: Message;
    objectStates : any[];
   options: any;
   options1: any;
   options2: any;
   options3: any;
   options4: any;
   options5: any;
   options6: any;
   options7: any;
   optionsJVM:any;
   optionsScat: any;
   reclaimedByteoptions: any;
   heapGCoptions: any;
   concurrentData:any[];
   pauseData:any[];
   gcViewerData: any;
   


   constructor(public commonService: CommonServices,
      private _ddrData: DdrDataModelService,
      private _navService: CavTopPanelNavigationService,
      private _router: Router,
      //private id: DdrDataModelService,
      private _cavConfigService: CavConfigService,
      private ddrRequest: DDRRequestService,
     private breadcrumbService :DdrBreadcrumbService
   ) {
   }

   ngOnInit() {
      //console.log("this.upload url",this.uploadUrl );
      this.uploadUrl = this.setIpWithProtocol() + '/' + this._ddrData.product + "/v1/cavisson/netdiagnostics/ddr/uploadgclog?";
      //this.ddrRequest.getDataUsingGet(this.uploadUrl).subscribe(data => (console.log(data)));     
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.GC_VIEW);   
      this.gcViewerData = this._ddrData.gcViewerData;
      this.do(this.gcViewerData);
}

   do(data: any) {
      this.comeOn = true;

      // this.makeajaxcall();
      // this.getGcData();
      this.doAssignValues(data);
   }
   

   gcStatsData: any[] = [
      { name: 'Total GC Count', value: '4399' },
      { name: 'Total Reclaimed Bytes', value: 'n/a' },
      { name: 'Total GC Time', value: '18 min 52 sec' },
      { name: 'Avg Gc Time', value: '337 ms' },
      { name: 'Gc avg Time std dev', value: '258' },
      { name: 'Gc Min Max Time', value: '20.2 ms/ 4 sec 754 ms' },
      { name: 'Gc Interval avg Time', value: '16 sec 555 ms' }
   ];

   setIpWithProtocol() {
      let hostUrl = "";

      if (this.getHostUrl().startsWith("http"))
         hostUrl = this.getHostUrl();
      else if (this.getHostUrl().startsWith("//"))
         hostUrl = location.protocol + this.getHostUrl();
      else
         hostUrl = location.protocol + "//" + this.getHostUrl();

      return hostUrl;
   }


   getHostUrl(isDownloadCase?): string {
      var hostDcName;
      hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
         this.id.testRun = this._ddrData.testRun;
         console.log("all case url==>", hostDcName, "all case test run==>", this.id.testRun);
      }
      console.log('hostDcName =', hostDcName);
      return hostDcName;
   }



   // makeajaxcall() {
   //    this.url = "";
   //    // let startTime = this.commonParams.startTime;
   //    // let endTime = this.commonParams.endTime;
   //   this.url = this.getHostUrl();
   // //   this.url = this.setIpWithProtocol() + '/' + this.id.product + "/v1/cavisson/netdiagnostics/ddr/uploadgclog?";
   //    // if(this.commonService.enableQueryCaching == 1){
   //    //   this.url += '/' + 'netdiagnostics/v1/cavisson/netdiagnostics/ddr/getGcLogData?cacheId='+ this.commonParams.testRun + '&testRun=' + this.commonParams.testRun;
   //    // }

   // //   this.url += '/' + 'netdiagnostics/v1/cavisson/netdiagnostics/webddr/getGcLogData';
   //    console.log("url", this.url);
   // }

   // getGcData() {
   //    this.ddrRequest.getDataUsingGet(this.url).subscribe(
   //       data => { this.doAssignValues(data) },
   //       error => {
   //          //this.loading = false{;
   //          if (error.hasOwnProperty('message')) {
   //             this.commonService.showError(error.message);
   //          }
   //       }
   //    );
   // }


   doAssignValues(res: any) {
      this.arrCase = res;
      console.log("this.arrcase", this.arrCase);
      this.csvData = res["csvdata"];
      console.log("this.csvData = ", this.csvData);
      if(res['summarydata'].length>0){
         this.summaryData = res['summarydata'];
         this.summaryDataFunc(this.summaryData);
         console.log("this.summaryData = ", this.summaryData);
      }
      this.concurrentData = res['concurrentdata'];
      this.pauseData = res['pausedata'];
      if(this.concurrentData.length>0 && this.pauseData.length>0){
      this.calculatePauseTimeCauseWiseData(this.concurrentData,this.pauseData);
      }
      this.calculateData = res["calculatedata"];
      this.commandLineFlagData = res["commandLineFlagData"];
      console.log("calculatedata", this.calculateData);
      console.log("commandLineFlagData", this.commandLineFlagData);
      this.causewiseData = res["causewisedata"];
      console.log("this.causewisedata", this.causewiseData);
      this.csvLineData = res["csvlinedata"];
      console.log("this.csvLineData", this.csvLineData);
      if(this.calculateData)
      this.calculateDataFunc(this.calculateData);
      if(this.csvData.length>0)
      this.getFilteredData(this.csvData);
      if(this.csvLineData.length>0)
      this.getLineData(this.csvLineData);
      
      if(this.causewiseData)
      this.causeWiseDataFunc(this.causewiseData);
   }

   calculateDataFunc(data: object[]) {
      console.log("passed data", data);
      
      this.avgPauseTime = Number(data['Avg Pause Time'].toFixed(3))*1000;
      this.maxPauseTime = Number(data['Max Pause Time'].toFixed(3))*1000;
      console.log("this.avgPauseTime ", this.avgPauseTime ,"maxPauseTime",this.maxPauseTime);

      let temp = JSON.stringify(data);

      console.log("temp", temp);

      temp = temp.replace(/{|\"|}/g, "");

      let newTemp = temp.split(",");

      console.log("newTemp", newTemp);

      this.calculateDataSplitted = [];

      for (var i = 0; i < newTemp.length; i++) {
	// let yvalue = parseFloat(newTemp[i].split(":")[1]).toFixed(3);

	this.calculateDataSplitted.push({ name: newTemp[i].split(":")[0], y: Number(Number(newTemp[i].split(":")[1]).toFixed(3)) });
      }

      console.log("calculateDataSplitted", this.calculateDataSplitted);
      const calculateChartDataSplitted = this.calculateDataSplitted.filter(o => (o.name !== "Total Sum"));
      console.log("calculateChartDataSplitted", calculateChartDataSplitted);

      // let barArrCollPhaseData=[];

      // for(var i=0;i<this.collectionPhaseData.length;i++).toFixed(3){

      //	barArrCollPhaseData.push({"name":this.collectionPhaseData[i]["name"],"y":this.collectionPhaseData[i]["avgTime"]});
      //  }

      //  console.log("barArrCollPhase",barArrCollPhaseData);


      this.options4 = {
         chart: {
            type: "pie",
            height:300,

         },
         credits: {
            enabled: false
         },
         title: {
            text: "GC causes",
            // style:{'fontSize':'13px'}
         },
         legend: {
            itemWidth: 100
         },
         tooltip: {
            pointFormat: '{point.name}: <b>{point.percentage:.2f}%</b>'
         },
         plotOptions: {
            pie: {
               allowPointSelect: true,
               cursor: 'pointer',
               dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.2f}% '
               },
               showInLegend: true
            }
         },
         series: [
            {
               name: "values",
               data: calculateChartDataSplitted,
               enableMouseTracking: true
            }
         ]}
   }
  public errorMessage(detail: string) {
  this._message = { severity: 'error', detail: detail };
    }

   onUpload($evt) {
      console.log("onupload", $evt);
     //console.log("Hello");
     console.log("this.upload url",this.uploadUrl );
     //this.uploadUrl = this.setIpWithProtocol() + '/' + this._ddrData.product + "/v1/cavisson/netdiagnostics/ddr/uploadgclog?";
     //this.ddrRequest.getDataUsingGet(this.uploadUrl).subscribe(data => (console.log(data)));


      let data = $evt.xhr.response;
      data = JSON.parse(data);
      this.loading = false;
      console.log("data in on", data);
      if (data.path) {
         this.id.heapPath = data.path;
         this._navService.addNewNaviationLink('ddr');
        this._router.navigate(['/home/ddr/uploadgclog']);
         //this.closeHeapDumpWin(); 
      console.log("I am here");
         return;
      }
    
      else if(data != null)
            this.do(data);
	else if(data.error)
        this.errorMessage(data.error);
      else
        this.errorMessage("Error is coming during analysing heap dump");
         //alert("error1111");
         //this.errorMessage("Error is coming during analysing heap dump");
      
      // return;
     
   }

   // public errorMessage(detail: string, summary?: string) {
   //    if (summary == undefined)
   //      this._message = [{ severity: 'error', detail: detail }];
   //    else
   //      this._message = [{ severity: 'error', summary: summary, detail: detail }];
  
   //    this.messageEmit(this._message);
   //    setTimeout(() => {
   //      this._message = [];
  
   //      this.messageEmit(this._message);
   //    }, 60000);
   //  }


   summaryDataFunc(summaryData) {

      console.log("summary data", summaryData);
      let data = JSON.parse(JSON.stringify(summaryData)); 

      const newArray = data.map(data => {

         const newObj = {};

         newObj["msg"] = data.msg;

         newObj["value"] = Number(data.value);

         newObj["unit"] = data.unit;

         return newObj;

      });

      console.log("decimalformattedcausewisedata", newArray);

      let old = data.find(o => o.msg === 'totalTenuredAllocMax');

      console.log("old generation", old);

      let young = data.find(o => o.msg === 'totalYoungAllocMax');
	

      let youngPeak = data.find(o => o.msg === 'totalYoungUsedMax');
      young.msg = young.msg.replace("totalYoungAllocMax","Young Generation");  
     young['peak'] = youngPeak['value'];

      console.log("young with peak", young);

      let oldPeak = data.find(o => o.msg === 'totalTenuredUsedMax');
      old.msg = old.msg.replace("totalTenuredAllocMax","Old Generation");
     old['peak'] = oldPeak['value'] ;

      console.log("old with peak", old);
     // young.value = young.value +  young.unit;
      //old.value = old.value +  old.unit;

      let total = data.find(o => o.msg === 'totalHeapAllocMax');
      let totalPeak = data.find(o => o.msg === 'totalHeapUsedMax');
      total.msg = total.msg.replace("totalHeapAllocMax","Total");
     total['peak'] = totalPeak['value'] ;
	  // total.value = total.value + total.unit;
      console.log("total with peak", total);

      this.jvmMemoryData = [];

      this.jvmMemoryData.push(young);

      this.jvmMemoryData.push(old);
      this.jvmMemoryData.push(total);


      console.log("jvmMemoryData", this.jvmMemoryData);
      this.jvmBarCart(this.jvmMemoryData);

      let throughPut = data.find(o => o.msg === 'throughput');
      this.avgThroughPut = throughPut.value;
      console.log("this.avgThroughPut", this.avgThroughPut);
      //throughPut.msg = throughPut.msg.replace("throughput","Throughput");
   //    let avgPause = data.find(o => o.msg === 'avgPause');
   //  avgPause.msg = avgPause.msg.replace("avgPause","Avg Pause GC Time");
	// avgPause.value =  parseFloat(avgPause.value).toFixed(3) + avgPause.unit;
   //    let maxPause = data.find(o => o.msg === 'maxPause');
   //    maxPause.msg = maxPause.msg.replace("maxPause","Max Pause GC Time");
	//  maxPause.value =  parseFloat(maxPause.value).toFixed(3) + avgPause.unit;
   //    this.latency = [];

   //    this.latency.push(avgPause);

   //    this.latency.push(maxPause);

   //    console.log("latency", this.latency);

      let totalCreated = data.find(o => o.msg === 'freedMemoryByGC');

      let totalPromoted = data.find(o => o.msg === 'promotionTotal');
	let avgPromoted = data.find(o => o.msg === 'Avg Promotion Rate');
	let avgCreation = data.find(o => o.msg === 'Avg Creation Rate');
	totalCreated.msg =totalCreated.msg.replace("freedMemoryByGC","Total created bytes");
	totalPromoted.msg = totalPromoted.msg.replace("promotionTotal","Total promoted bytes");
	 totalCreated.value = totalCreated.value + totalCreated.unit;
	 totalPromoted.value = totalPromoted.value + totalPromoted.unit;
	 avgPromoted.value = parseFloat(avgPromoted.value).toFixed(3) + avgPromoted.unit;
    avgCreation.value = parseFloat(avgCreation.value).toFixed(3) + avgCreation.unit;
    totalCreated.tooltip = "Amounts of bytes created by the application. To have best performance, create as minimal bytes as possible";
     totalPromoted.tooltip = "Amounts of bytes that are promoted from Young Generation to Old Generation";
     avgPromoted.tooltip = "Objects promoted rate from Young Generation to Old Generation. When more objects are promoted to Old generation,   Full GC will be run more frequently.";
     avgCreation.tooltip = "Objects creation rate by the application. When more objects are created, more GCs has to be run to reclaim those objects from memory.   Single best tip for optimized performance is to keep the allocation rate as low as possible.";
    
      this.objectStates = [];

      this.objectStates.push(totalCreated);

      this.objectStates.push(totalPromoted);
	this.objectStates.push(avgCreation);
	this.objectStates.push(avgPromoted);

   }

   causeWiseDataFunc(data: object[]) {

      this.causewiseDataSplitted = [];

      this.causewiseDataSplitted = data;

      console.log("cause wise data splitted", this.causewiseDataSplitted);

      this.decimalFormattedCauseWiseData = [];

      this.decimalFormattedCauseWiseData = this.reformatData(this.causewiseDataSplitted);

      console.log("causewisedataDecimal", this.decimalFormattedCauseWiseData);
	const chartDecimalFormattedCauseWiseData = this.decimalFormattedCauseWiseData.filter(o => (o.msg !== "Total"));

      this.chartDataFunc(chartDecimalFormattedCauseWiseData);

      this.barDataFunc(chartDecimalFormattedCauseWiseData);

     // this.calculatePauseTimeCauseWiseData(this.decimalFormattedCauseWiseData);



   }


   reformatData(data): object[] {

      const newArray = data.map(data => {

         const newObj = {};

         newObj["msg"] = data.msg;

         newObj["count"] = Number(data.count);

         newObj["avg"] = parseFloat(data.avg).toFixed(3);

         newObj["sum"] = parseFloat(data.sum).toFixed(3);

         newObj["min"] = parseFloat(data.min).toFixed(3);

         newObj["max"] = Number(data.max).toFixed(3);

         // return our new object.
         return newObj;

      });

      console.log("decimalformattedcausewisedata", newArray);

      return newArray;

   }


   chartDataFunc(data: any) {
      let temp= [];
      this.chData = [];
      temp=data;
      for (var i = 0; i < temp.length; i++) {
         this.chData.push({ "name": temp[i]["msg"], "y": Number(temp[i]["sum"]) });
      }
      console.log("chart Data>>>>>>>>>", this.chData);

      this.options3 = {
         chart: {
            type: "pie"
         },
         credits: {
            enabled: false
         },
         title: {
            text: "Total Time(Sec)",
            // style:{'fontSize':'13px'}
         },
         legend: {
            itemWidth: 100
         },
         tooltip: {
            pointFormat: '{point.name}: <b>{point.y:.2f}</b>'
         },
         plotOptions: {
            pie: {
               allowPointSelect: true,
               cursor: 'pointer',
               dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.y:.2f}'
               },
               showInLegend: true
            }
         },
         series: [
            {
               name: "values",
               data: this.chData,
               enableMouseTracking: true
            }
         ]

      }
   }

   barDataFunc(data) {
   let temp= [];
   this.barData = [];
   this.barDataName = [];
   temp=data;
      for (var i = 0; i < temp.length; i++) {

         this.barDataName.push(temp[i]["msg"]);

         this.barData.push(Number(temp[i]["avg"]));

      }
      console.log("chart Data>>>>>>>>>", this.barDataName);
      console.log("chart Data>>>>>>>>>", this.barData);

      this.options7 = {
         chart: {
            type: 'bar'
         },
         title: {
            text: 'Avg Time(Sec)'
         },
         xAxis: {
            categories: this.barDataName,
            title: {
               text: null
            }
         },
         yAxis: {
            min: 0, title: {
               align: 'high'
            },
            labels: {
               overflow: 'justify'
            }
         },

         plotOptions: {
            bar: {
               dataLabels: {
                  enabled: true
               }
            },
            series: {
               stacking: 'normal'
            }
         },
         credits: {
            enabled: false
         },
         series: [{
            data: this.barData

         }]
      }




   }

   calculatePauseTimeCauseWiseData(concurrentData,pauseData){

      // const newArrayPause = data.filter(o => ((o.msg === "Final Remark") || (o.msg === "Initial Mark") || (o.msg === "Young GC") || (o.msg === "Full GC")));

      // console.log("newArrayPause array", newArrayPause);

      // const newArrayconc = data.filter(o => ((o.msg === "CMS-concurrent-abortable-preclean") || (o.msg === "CMS-concurrent-mark") || (o.msg === "CMS-concurrent-preclean") || (o.msg === "CMS-concurrent-reset") || (o.msg === "CMS-concurrent-sweep")));

      //console.log("concurrentData>>>>>>", this.concurrentData,"<<<<<<<<<<this.pauseData>>>>>>>>",this.pauseData);

      this.pauseTime = this.calculateCMSdata(pauseData);

      console.log("pauseTime", this.pauseTime);
      //console.log("newArrayconc array", newArrayconc);

      this.concTime = this.calculateCMSdata(concurrentData);

      console.log("concurrent time", this.concTime);

      this.pauseCon_chData = [];

      this.pause_barData  = [];
      this.concurrent_barData = [];

      this.pauseConchartData(this.pauseTime, this.concTime);

      this.pauseConBarData(this.pauseTime, this.concTime);


   }


   calculateCMSdata(data): object[] {

      // const sum = data.map(o => Number(o.avg)).reduce((a, b) => a + b, 0);

      // const avg = (sum / data.length).toFixed(3);

      // const totalTime = data.map(o => Number(o.sum)).reduce((a, b) => a + b, 0).toFixed(3);

      // const minn = data.map(o => Number(o.min)).reduce((min, b) => b < min ? b : min, Number(data[0].min)).toFixed(3);

      // const maxx = data.map(o => Number(o.max)).reduce((max, b) => b > max ? b : max, Number(data[0].max)).toFixed(3);

	//totalTime = parseFloat(totalTime).toFixed(3);
	//avg = parseFloat(avg).toFixed(3);
	//minn = parseFloat(minn).toFixed(3);
	//maxx= parseFloat(maxx).toFixed(3);
      const newArrobj = [];
      newArrobj.push({ name: "Count", value:  (Number(data[0].count)) });

      newArrobj.push({ name: "Total Time", value:  (Number(data[0].sum).toFixed(3)) });

      newArrobj.push({ name: "Avg Time", value: (Number(data[0].avg).toFixed(3)) });

      newArrobj.push({ name: "Min Time", value: (Number(data[0].min).toFixed(3)) });

      newArrobj.push({ name: "Max Time", value: (Number(data[0].max).toFixed(3)) });

      console.log(" Data", newArrobj);

      return newArrobj;


   }

   pauseConchartData(dataPauseTime, dataConcTime) {

      let newPause;

      dataPauseTime.forEach(function (item) {

         if (item.name == 'Total Time') {

            console.log("string name", item.name);
            newPause = Number(item.value).toFixed(2);

            console.log("value>>>>>>>>>>", newPause);
         }
      });

      this.pauseCon_chData.push({ name: "Pause GC Time", y: Number(newPause) });

      let newConc;

      dataConcTime.forEach(function (item) {

         if (item.name == 'Total Time') {

            newConc = Number(item.value).toFixed(2);
         }
      });

      this.pauseCon_chData.push({ name: "Concurrent GC Time", y: Number(newConc) });

      console.log("avg of pause time in pauseConchData", this.pauseCon_chData);

      this.options5 = {
         chart: {
            type: "pie"
         },
         credits: {
            enabled: false
         },
         title: {
            text: "Total Time(sec)",
            // style:{'fontSize':'13px'}
         },
         legend: {
            layout: 'horizontal',
            margin:20 
         },
         tooltip: {
            pointFormat: '{point.name}: <b>{point.y:.1f} sec</b>'
         },
         plotOptions: {
            pie: {
               allowPointSelect: true,
               cursor: 'pointer',
               dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.y:.1f} sec '
               },
               showInLegend: true
            }
         },
         series: [
            {
               name: "values",
               data: this.pauseCon_chData,
               enableMouseTracking: true
            }
         ]

      }

   }

   pauseConBarData(dataPauseTime, dataConcTime) {

      let newPause;

      dataPauseTime.forEach(function (item) {

         if (item.name == 'Avg Time') {

            console.log("string name", item.name);
            newPause = Number(item.value).toFixed(2);
         }
      });

      this.pause_barData.push(Number(newPause));

      let newConc;

      dataConcTime.forEach(function (item) {

         if (item.name == 'Avg Time') {

            newConc = Number(item.value).toFixed(2);
         }
      });

      this.concurrent_barData.push(Number(newConc));
      console.log("avg of pause time in pause_barData", this.pause_barData);
      console.log("avg of pause time in concurrent_barData", this.concurrent_barData);

      this.options6 = {
         chart: {
            type: 'column'
         },
         title: {
            text: 'Average Time(sec)'
         },
         xAxis: {
            catagories: ['Pause Time', 'Concurrent Time'],
            title: {
               
            }
         },
         yAxis: {
            tickInterval: 0.05,
            title: {
               align: 'high'
            },
            labels: {
               overflow: 'justify'
            }
         },

         plotOptions: {
            column: {
               dataLabels: {
                  enabled: true
               }
            },
         },
         credits: {
            enabled: false
         },
         series: [{
           name: 'Pause Time',
           data: this.pause_barData
     }, {
         name: 'Concurrent Time',
         data: this.concurrent_barData
         },
         ]
      }
   }

   PauseGCDuration(newArrayYoungGC,newArrayFullGC)
   {
      this.optionsScat = {
         chart: {
            type: 'scatter',
            zoomType: 'x',
            width:900,
            height:500,
        },
        title: {
            text: 'Pause GC Duration Time'
        },  
        credits: {
          enabled: false
        },
        xAxis: {
           
           type: 'datetime',
           dateTimeLabelFormats: {
              second: '%M:%S'
            },
            title: {
               text: 'Time'
            },
            labels: {
               align: 'right',
               rotation: -30
           },
            // startOnTick: true,
            //endOnTick: true,
            // showLastLabel: true
        },
        yAxis: {
         min:0,
            title: {
                text: 'Time (ms)'
            }
        },
        legend: {
            layout: 'horizontal',
            margin:20 
            // align: 'centre',
           // borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 6,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                  headerFormat: '<b>Pause Duration:</b>{point.y} ms<br>',
                  pointFormat: '<b>Time:</b> {point.x: %M:%S} '
                }
            }
        },
        series: [{
         name: 'Young GC',
         color: 'rgba(0, 0, 255, 0.6)',
         data: newArrayYoungGC,
         pointStart: 0
 
     }, {
         name: 'Full GC',
         color: 'rgba(255, 0, 0, 0.8)',
         data: newArrayFullGC,
         pointStart: 0
     }]
    };

   }

   getFilteredData(csvData){ 
      let tempData = JSON.parse(JSON.stringify(csvData)); 
		const temp = tempData.filter(o => ((o.gcType === "GC")));
     let newArrayYoungGC = this.getPauseGCData(temp);
     let ReclaimedYoungGC = this.getReclaimedBytesData(temp);
		console.log("newArrayPause array in getfilter yong", newArrayYoungGC);

      const temp1 = tempData.filter(o => (o.gcType === "Full"));
      let newArrayFullGC = this.getPauseGCData(temp1);
      let ReclaimedFullGC = this.getReclaimedBytesData(temp1);
      console.log("newArrayPause array in get filter full", newArrayFullGC);
      this.PauseGCDuration(newArrayYoungGC,newArrayFullGC);
      this.reclaimedByteChart(ReclaimedYoungGC,ReclaimedFullGC);
      
     }
     
   getPauseGCData(csvData){  
      console.log("Data for time pause gc graph",csvData);
    let items: Object = {};
     var key;
     for (var k = 0; k < csvData.length; k++) {
       var key: any = csvData[k]['initialTimeStamp']*1000;
         items[key] = Number((csvData[k]['time']*1000).toFixed(0));
     }
     let outputArr = [];
     let timestamp = [];
     timestamp = Object.keys(items);
     timestamp.forEach((val, index) => {
       outputArr.push([+val, items[val]]);
     });
     outputArr.sort(function (a, b) {
       var value = a[0];
       var value1 = b[0];
       return (value > value1) ? 1 : ((value < value1) ? -1 : 0);
     });
 console.log("outputArr>>>>>>>>>>>>>>>>>+++++++++++++",outputArr);
 
 return outputArr;
 }

 
 reclaimedByteChart(ReclaimedYoungGC,ReclaimedFullGC){
   this.reclaimedByteoptions = {
      chart: {
         type: 'scatter',
         zoomType: 'x',
         width:900,
         height:500,
     },
     title: {
         text: 'Reclaimed Bytes'
     },        
     credits: {
      enabled: false
    },
     xAxis: {
        //min: 0,
         title: {
            // enabled: true,
             text: 'Time'
         },           type: 'datetime',
         dateTimeLabelFormats: {
            second: '%M:%S'
          },
          labels: {
             align: 'right',
             rotation: -30
         },
     },
     yAxis: {
         min: 0,
         title: {
             text: 'Memory (MB)'
         }
     },
     legend: {
      layout: 'horizontal',
      margin:20 
     },
     plotOptions: {
         scatter: {
             marker: {
                 radius: 6,
                 states: {
                     hover: {
                         enabled: true,
                         lineColor: 'rgb(100,100,100)'
                     }
                 }
             },
             states: {
                 hover: {
                     marker: {
                         enabled: false
                     }
                 }
             },
             tooltip: {
               headerFormat: '<b>Reclaimed Bytes:</b>{point.y} mb<br>',
               pointFormat: '<b>Time:</b> {point.x: %M:%S} '
             }
         }
     },
     series: [{
      name: 'Young GC',
      color: 'rgba(0, 0, 255, 0.6)',
     data: ReclaimedYoungGC

  }, {
      name: 'Full GC',
      color: 'rgba(255, 0, 0, 0.8)',
     data: ReclaimedFullGC
  }]
 };

}

 getReclaimedBytesData(csvData){  
   console.log("Data for time pause gc graph",csvData);
 let items: Object = {};
  var key;
  for (var k = 0; k < csvData.length; k++) {
    var key: any = csvData[k]['initialTimeStamp']*1000;
      items[key] = Number(((csvData[k]['reclaimedByte'])/1024).toFixed(3));
  }
  let outputArr = [];
  let timestamp = [];
  timestamp = Object.keys(items);
  timestamp.forEach((val, index) => {
    outputArr.push([+val, items[val]]);
  });
  outputArr.sort(function (a, b) {
   var value = a[0];
   var value1 = b[0];
   return (value > value1) ? 1 : ((value < value1) ? -1 : 0);
 });
console.log("outputArr>>>>>>>>>>>>>>>>-----",outputArr);

return outputArr;
}   
lineHeapUsageChart(Chartdata:any){

      this.heapGCoptions = {
        chart: {
          type: 'spline',
          zoomType: 'x',
          width:900,
          height:500,
        },
        title: {
          text: 'Heap Usage',
        },
        credits: {
          enabled: false
        },
          xAxis: {
            min: 0,
            //tickInterval: 1,
             type: 'datetime',
             dateTimeLabelFormats: {
                second: '%M:%S'
              },
              title: {
                 text: 'Time'
              },
              labels: {
                 align: 'right',
                 rotation: -30
             },
             
          },
          yAxis: {
              title: {
                  text: 'Heap size (MB)'
              }
          },

        tooltip: {
          headerFormat: '<b>{series.name}: </b>{point.y} mb<br>',
          pointFormat: '<b>Time:</b> {point.x: %M:%S} '
        },
        plotOptions: {
          spline: {
            marker: {
               radius: 4,
              enabled: true
            }
          }
        },
       series: [{
           showInLegend: false,
           name: 'Full GC',
           marker: {
            symbol: 'square'
            },
          // color: 'rgba(0, 0, 255, 0.6)',
           data: Chartdata,
           // [[1571669049000, 1],[1571669051000, 1],[1571669052000, 3],[1571669093000, 3],[1571669380000, 1]],
       }]

      };
  
  
     }

// getFiltereLinedData(csvLineData){ 
//    let tempData = JSON.parse(JSON.stringify(csvLineData)); 
//    const temp = tempData.filter(o => ((o.gcType === "GC")&&(o.gcCause === "Allocation Failure")));
//   let linedataYoungGC = this.getLineData(temp);
//    console.log("newArrayPause array in getfilter yong", linedataYoungGC);

//    const temp1 = tempData.filter(o => (o.gcType === "Full"));
//    let linedataFullGC = this.getLineData(temp1);
//    console.log("newArrayPause array in get filter full", linedataFullGC);
//    this.lineHeapUsageChart(linedataYoungGC,linedataFullGC);
//   }

getLineData(csvData){  
   console.log("Data for getLineData graph",csvData);
 let items: Object = {};
  var key;
  for (var k = 0; k < csvData.length; k++) {
    var key: any = csvData[k]['timestamp']*1000;
      items[key] = Number(((csvData[k]['usedMemory'])/1024).toFixed(3));
      //items[key] = (((csvData[k]['usedMemory'])/1024).toFixed(3)+"," +(csvData[k]['gcCause']));

  }
  let outputArr = [];
  let timestamp = [];
  timestamp = Object.keys(items);
  timestamp.forEach((val, index) => {
    outputArr.push([+val, items[val]]);
  });
  outputArr.sort(function (a, b) {
   var value = a[0];
   var value1 = b[0];
   return (value > value1) ? 1 : ((value < value1) ? -1 : 0);
 });

console.log("outputArr>>>>>>>********",outputArr);
this.lineHeapUsageChart(outputArr);

}

    /**Formatter cell data for percentage field */
    valueFormatter(value) {
      if (!isNaN(value) && (value != 100 && value != 0)) {
          return Number(value).toFixed(3);
      }
      else
          return value;
  }
    /**Simple formater for tolocalstring */
    formatter(value) {
      if (!isNaN(value)) {
          return (Number(value)).toLocaleString() + " M";

      }
      else
          return value;
  }

jvmBarCart(data:any){
   console.log("jvmBarCart>>>>>>>>",data);

   let temp= [];
   temp=data;
   let barYoungData= [] ;
   let barOldData= [];
   let barTotaldata= [];
   for (var i = 0; i < temp.length; i++) {
      if(i==0){
         barYoungData.push(Number(temp[i]['value']));
         barYoungData.push(Number(temp[i]['peak']));
      }
      if(i==1){
         barOldData.push(Number(temp[i]['value']));
         barOldData.push(Number(temp[i]['peak']));
      }
      if(i==2){
         barTotaldata.push(Number(temp[i]['value']));
         barTotaldata.push(Number(temp[i]['peak']));
      }

   }
   this.optionsJVM = {
   chart: {
      type: 'bar',
      height:250,
  },
  title: {
      text: 'JVM memory size- Allocated vs Peak(mb)'
  },
  credits: {
   enabled: false
 },
  xAxis: {
      categories: ['allocated', 'peak Usage']
  },
  yAxis: {
      min: 0,
      title: {
          text: 'memory(mb)'
      }
  },
//   legend: {
//       reversed: true
//   },
  plotOptions: {
      series: {
          stacking: 'normal'
      }
  },
  series: [{
   name: 'Young Generation',
   data: barYoungData
},
{
   name: 'Old Generation',
   data: barOldData
},
{
   name: 'Total',
   data: barTotaldata
}
]};

}
//  Custom soting for tables

    Customsort(event, tempData) {
    //    console.log("Custom sort evenvt",event)
        let fieldValue = event["field"];
        if (event.order == -1) {
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                var value = parseFloat(a[fieldValue]);
                var value2 = parseFloat(b[fieldValue]);
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                var value = parseFloat(a[fieldValue]);
                var value2 = parseFloat(b[fieldValue]);
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }
        this.decimalFormattedCauseWiseData = [];
		
        if (tempData) {
            tempData.map((rowdata) => { this.decimalFormattedCauseWiseData = this.Immutablepush(this.decimalFormattedCauseWiseData, rowdata) });
        }
    }

    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }

    custCausesSort(event, tempData) {
      //console.log("Custom sort evenvt",event);
        let fieldValue = event["field"];
        if (event.order == -1) {
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                var value = parseFloat(a[fieldValue]);
                var value2 = parseFloat(b[fieldValue]);
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                var value = parseFloat(a[fieldValue]);
                var value2 = parseFloat(b[fieldValue]);
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }
        this.calculateDataSplitted = [];
		
        if (tempData) {
            tempData.map((rowdata) => { this.calculateDataSplitted = this.Immutablepush(this.calculateDataSplitted, rowdata) });
        }
    }
}
