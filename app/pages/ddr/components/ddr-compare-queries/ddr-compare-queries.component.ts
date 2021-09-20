import { Component, OnInit,Input, SimpleChanges,OnChanges} from '@angular/core';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
// import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import {HttpClient} from '@angular/common/http';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import { Message } from 'primeng/api';
import { MessageService } from '../../services/ddr-message.service';
import { timeout } from 'rxjs/operators';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-ddr-compare-queries',
  templateUrl: './ddr-compare-queries.component.html',
  styleUrls: ['./ddr-compare-queries.component.css']
})
export class DdrCompareQueriesComponent implements OnInit,OnChanges {
  highcharts = Highcharts;
@Input('value') compareFPInfo:any[];
loading:boolean=false;
  constructor(private commonServices:CommonServices,private http:HttpClient,private _ddrData : DdrDataModelService,
    private ddrRequest:DDRRequestService, private messageService: MessageService) { }

 globalQueryParams:any;
 queryObjArr:any[]=[];
 queryCountArr:Object[]=[];
 avgTimeArr:Object[]=[];
 cumTimeArr:Object[]=[];
 errorCountArr:Object[]=[];
 options:Object;
 options1:Object;
 options2:Object;
 options3:Object;
 compareQueryData:Object;
 colour:string[]=[];
 queryName:string="";
 query:string="";
 Completequery="";
 strTitle:string="";
 filterCriteriaStr :string="";
errMsg: Message[];
   ngOnInit() {
     this.colour=['green','blue'];
    
   }
  ngOnChanges()
  {
    this.loading=true;
    console.log(this.compareFPInfo);
    this.globalQueryParams=this.commonServices.getData();
    this.getComparedDBData();
  }
  getComparedDBData()
  {
   // alert("in this case");
    let cmdArgs='';
    let testRun;
    let com_db_url = '';
    console.log("globalQueryParams",this.globalQueryParams);
        for(let i=0;i<this.compareFPInfo.length;i++)
        {
         // alert("startTimeInMS"+Number(this.compareFPInfo[i]['startTimeInMs'])+"fpduartion"+Number(this.compareFPInfo[i]['fpDuration']));
          let fpDuration=0;
          if(this.compareFPInfo[i].fpDuration == '< 1') 
            fpDuration = 0;
	        else if(this.compareFPInfo[i].fpDuration.toString().includes(','))
            fpDuration =this.compareFPInfo[i].fpDuration.toString().replace(/,/g,"");
        	else
	        	fpDuration = this.compareFPInfo[i].fpDuration;
          let endTime= Number(this.compareFPInfo[i]['startTimeInMs'])+Number(fpDuration);
         
           if(this.commonServices.testRun)
           testRun=this.commonServices.testRun;
           else
           testRun=this.globalQueryParams['testRun'];
          cmdArgs+= testRun+","+this.compareFPInfo[i]['startTimeInMs']+","+endTime+","+this.compareFPInfo[i]['urlIndex']+","+this.compareFPInfo[i]['tierId']+","+this.compareFPInfo[i]['serverId']+","+this.compareFPInfo[i]['appId']+","+this.compareFPInfo[i]['flowpathInstance']+",%%%,";
          console.log(this.commonServices.testRun)
          }
        console.log("commandargs",cmdArgs);
        let url;
    url = this.getHostUrl();
    if(this.commonServices.enableQueryCaching == 1){
       com_db_url=url + '/' + this.globalQueryParams.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/compareFPQueries?cacheId="+ testRun + "&cmdArgs="+cmdArgs ;
    }
    else{
       com_db_url=url + '/' + this.globalQueryParams.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/compareFPQueries?cmdArgs="+cmdArgs;
    }


      this.ddrRequest.getDataUsingGet(com_db_url).pipe(timeout(this.commonServices.ajaxTimeOut)).subscribe(
    data => {(this.doAssignValuForCompareDBdata(data))},
     error => {
        this.loading = false;
        if (error.hasOwnProperty('message') && error.name =="TimeoutError") {
          this.showError('Query taking more time than ' + this.commonServices.ajaxTimeOut + ' ms to give response');
        }
         else if (error.hasOwnProperty('statusText')) {
            this.showError(error.statusText);
            console.error(error);
          }
        else {
         this.showError('Rest Failed');
         console.error(error);
        }
      } 
  );
  }
   showError(msg: any) {
    this.errMsg = [];
    this.errMsg.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }
 doAssignValuForCompareDBdata(data)
 {
   this.loading=false;
    this.assignCompareQueryData(data);
  this.compareQueryData=data;
    if(this.queryObjArr.length >0)
    {
      this.getBarChartsDataBasedOnQuery(this.queryObjArr[0]['query']);
    this.createQueryCountBarChart();
    this.createAvgTimeBarChart();
    this.createCumTimeBarChart();
    this.createErrorCountBarChart();
    }
 }

 getBarChartsDataBasedOnQuery(query:string)
 {
   console.log("query value---",query)
   this.query=query;
if (this.query.length > 40)
    {
    this.queryName = this.query.substring(0, 40) + "...";
    this.Completequery = this.query;
     }
  else {
    this.queryName = this.query;
    this.Completequery = this.query;	
  }
   var arr=this.compareQueryData[query];
   let queryCountArr=[];
   let avgTimeArr=[];
   let cumTimeArr=[];
   let errorCountArr=[];
   arr.forEach((val,index)=>{
       if(arr.length > (index+1))
           {
   //alert(this.colour[index]);
      if(val['counts'] !== -9999.0)
     queryCountArr.push({"name":"FP"+(index+1),"y":val['counts'],color:this.colour[index]});
      if(val['avg'] !== -9999.0)
     avgTimeArr.push({"name":"FP"+(index+1),"y":val['avg'],color:this.colour[index]});
      if(val['cumTime'] !== -9999.0)
     cumTimeArr.push({"name":"FP"+(index+1),"y":val['cumTime'],color:this.colour[index]});
     if(val['errCounts'] !== -9999.0)
     errorCountArr.push({"name":"FP"+(index+1),"y":val['errCounts'],color:this.colour[index]});
           }
   });
   console.log(queryCountArr);
   this.queryCountArr=queryCountArr;
   this.avgTimeArr=avgTimeArr;
   this.cumTimeArr=cumTimeArr;
   this.errorCountArr=errorCountArr;
 }
 createErrorCountBarChart()
 {
   let errorCountArr=this.errorCountArr;
 //  console.log("queryCount ",this.queryCountArr);
 // let queryCountArr=this.queryCountArr;
  this.options3 =  {
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
          text: 'Error Count'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
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
            //  this.filterTopMethod(event);
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
  series : [{
          showInLegend: false,
          enableMouseTracking: true,
          name: '',
          data: errorCountArr
  }]
                };
 }
 showQueryrelatedData(node)
 {
    console.log(node);
    this.queryName=node['query'];
     this.getBarChartsDataBasedOnQuery(node['query']);
    this.createQueryCountBarChart();
    this.createAvgTimeBarChart();
    this.createCumTimeBarChart();
    this.createErrorCountBarChart();
 }
 createCumTimeBarChart()
 {
    let cumTimeArr=this.cumTimeArr;
 //  console.log("queryCount ",this.queryCountArr);
 // let queryCountArr=this.queryCountArr;
  this.options2 =  {
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
          text: 'Cum Time(ms)'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
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
            //  this.filterTopMethod(event);
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
  series : [{
          showInLegend: false,
          enableMouseTracking: true,
          name: '',
          data: cumTimeArr
  }]
                };
 }
 createAvgTimeBarChart()
 {
   let avgTimeArr=this.avgTimeArr;
 //  console.log("queryCount ",this.queryCountArr);
 // let queryCountArr=this.queryCountArr;
  this.options1 =  {
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
          text: 'Avg Execution Time(ms)'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
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
            //  this.filterTopMethod(event);
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
  series : [{
          showInLegend: false,
          enableMouseTracking: true,
          name: '',
          data: avgTimeArr
  }]
                };
 }
 assignCompareQueryData(data)
 {
     var queryObjArr=[];
    let compQueriesArr=Object.keys(data);
    compQueriesArr.forEach((val,ind)=> {
        let queryObj={};
           let compQueryDataArr=data[val];
          
           let compQueryDataLength=compQueryDataArr.length;
           compQueryDataArr.forEach((val1,index)=>{
             if(val1['query'] !="-9999")
             {
             queryObj['query']=val1['query'];
             }
             if(compQueryDataLength == (index+1))
           {
              var objectKeys=Object.keys(val1);
             objectKeys.forEach((val2,index2)=>{
               if(val1[val2]!= "-9999" && val1[val2] != "-9999.0")
                queryObj[val2+"_Changes"]=this.formatter(Number(val1[val2]).toFixed(3));
                else
                 queryObj[val2+"_Changes"]="-";
             });
           }
           else
           {
             var objectKeys=Object.keys(val1);
             objectKeys.forEach((val2,index2)=>{
                 if(val1[val2]!= "-9999" && val1[val2] != "-9999.0")
                queryObj[val2+"_FP"+(index+1)]=this.formatter(val1[val2]);
                else
                 queryObj[val2+"_FP"+(index+1)]="-";
             });
           }
           
           });
           console.log(queryObj);
           queryObjArr.push(queryObj);  
    });
      console.log(queryObjArr);
    this.queryObjArr=queryObjArr;
 }
  formatter(data: any) {
    if(Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }
createQueryCountBarChart()
{
  console.log("queryCount ",this.queryCountArr);
  let queryCountArr=this.queryCountArr;
  this.options =  {
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
          text: 'Query Count'
        },
        labels:
        {
          enabled: false
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Value'
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
            //  this.filterTopMethod(event);
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
  series : [{
          showInLegend: false,
          enableMouseTracking: true,
          name: '',
          data: queryCountArr
  }]
                };
console.log(this.options);
}

/* Filter Cretira */

showFilterCriteria() {

  if (this.compareFPInfo[0]['tierName'] != "NA" && this.compareFPInfo[0]['tierName'] != "" && this.compareFPInfo[0]['tierName'] != undefined && this.compareFPInfo[0]['tierName'] != "undefined" && this.compareFPInfo[1]['tierName'] != "NA" && this.compareFPInfo[1]['tierName'] != "" && this.compareFPInfo[1]['tierName'] != undefined && this.compareFPInfo[1]['tierName'] != "undefined")
  {
    if (this.compareFPInfo[0]['tierName'] == this.compareFPInfo[1]['tierName'])
    this.filterCriteriaStr = "Tier=" + this.compareFPInfo[0]['tierName'];
    else
    this.filterCriteriaStr = "Tier=" + this.compareFPInfo[0]['tierName']+","+this.compareFPInfo[1]['tierName'];
  }
  if (this.compareFPInfo[0]['serverName'] != "NA" && this.compareFPInfo[0]['serverName'] != "" && this.compareFPInfo[0]['serverName'] != undefined && this.compareFPInfo[0]['serverName'] != "undefined" && this.compareFPInfo[1]['serverName'] != "NA" && this.compareFPInfo[1]['serverName'] != "" && this.compareFPInfo[1]['serverName'] != undefined && this.compareFPInfo[1]['serverName'] != "undefined")
  {
    if (this.compareFPInfo[0]['serverName'] == this.compareFPInfo[1]['serverName'])
    this.filterCriteriaStr += ", Server" + this.compareFPInfo[0]['serverName'];
    else
    this.filterCriteriaStr += ", Server" + this.compareFPInfo[0]['serverName']+","+this.compareFPInfo[1]['serverName'];
  }
  if (this.compareFPInfo[0]['appName'] != "NA" && this.compareFPInfo[0]['appName'] != "" && this.compareFPInfo[0]['appName'] != undefined && this.compareFPInfo[0]['appName'] != "undefined" && this.compareFPInfo[1]['appName'] != "NA" && this.compareFPInfo[1]['appName'] != "" && this.compareFPInfo[1]['appName'] != undefined && this.compareFPInfo[1]['appName'] != "undefined")
  {
    if (this.compareFPInfo[0]['appName'] == this.compareFPInfo[1]['appName'])
    this.filterCriteriaStr += ", Instance=" + this.compareFPInfo[0]['appName'];
    else
    this.filterCriteriaStr += ", Instance=" + this.compareFPInfo[0]['appName']+","+this.compareFPInfo[1]['appName'];
  }
  if (this.compareFPInfo[0]['urlName'] != "NA" && this.compareFPInfo[0]['urlName'] != "" && this.compareFPInfo[0]['urlName'] != undefined && this.compareFPInfo[0]['urlName'] != "undefined" && this.compareFPInfo[1]['urlName'] != "NA" && this.compareFPInfo[1]['urlName'] != "" && this.compareFPInfo[1]['urlName'] != undefined && this.compareFPInfo[1]['urlName'] != "undefined")
  {
    if (this.compareFPInfo[0]['urlName'] == this.compareFPInfo[1]['urlName'])
    this.filterCriteriaStr += ", BT=" + this.compareFPInfo[0]['urlName'];
    else
    this.filterCriteriaStr += ", BT=" + this.compareFPInfo[0]['urlName']+","+this.compareFPInfo[1]['urlName'];
  }


}

     /*Method is used get host url*/
    getHostUrl(isDownloadCase?): string {
      var hostDcName;
      if(this._ddrData.isFromtrxFlow){
      hostDcName = "//" + this._ddrData.hostTr + ":" + this._ddrData.portTr;
       this._ddrData.testRun=this._ddrData.testRunTr;
      //   return hostDCName;
      } 
      else {
       hostDcName = this._ddrData.getHostUrl(isDownloadCase);
      // if(!isDownloadCase &&sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
      // { 
      //   hostDcName = this._ddrData.protocol + "://"+ this._ddrData.host + ':' +this._ddrData.port ;
      // //  this.testRun=this._ddrData.testRun;
      //  // this.urlParam.testRun= this._ddrData.testRun;
      //   console.log("all case url==>",hostDcName,"all case test run==>", "hostDcName---",hostDcName);
      // }
      // else if (this._navService.getDCNameForScreen("methodCallingTree") === undefined)
      //   hostDcName = this._cavConfigService.getINSPrefix();
      // else
      //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("methodCallingTree");

      // if (hostDcName.length > 0) {
      //   sessionStorage.removeItem("hostDcName");
      //   sessionStorage.setItem("hostDcName", hostDcName);
      // }
      // else
      //   hostDcName = sessionStorage.getItem("hostDcName");
      }
      console.log('hostDcName =', hostDcName);
      return hostDcName;
    }
      
    downloadReports(reports: string) {
      this.setTestRunInHeader();
      this.showFilterCriteria();
    let renameArray;
    let colOrder;
    
      renameArray = {
      'query': 'Query', 'counts_FP1': 'Count_FP1', 'counts_FP2': 'Count_FP2',
      'counts_Changes': 'Count_Changes', 'avg_FP1': 'Avg Time(ms)_FP1', 'avg_FP2': 'Avg Time(ms)_FP2','avg_Changes': 'Avg Time(ms)_Changes',
      'cumTime_FP1': 'Cum Time(ms)_FP1', 'cumTime_FP2': 'Cum Time(ms)_FP2','cumTime_Changes': 'Cum Time(ms)_Changes','errCounts_FP1':'Error Count_FP1','errCounts_FP2': 'Error Count_FP2',
      'errCounts_Changes': 'Error Count_Changes'
    };
     colOrder = [
      'Query', 'Count_FP1', 'Count_FP2', 'Count_Changes', 'Avg Time(ms)_FP1', 'Avg Time(ms)_FP2',
      'Avg Time(ms)_Changes', 'Cum Time(ms)_FP1', 'Cum Time(ms)_FP2', 'Cum Time(ms)_Changes', 'Error Count_FP1', 'Error Count_FP2', 'Error Count_Changes'
    ];
    this.queryObjArr.forEach((val, index) => {
      delete val['sqlIdx_FP1'];
      delete val['sqlIdx_FP2'];
      delete val['sqlIdx_Changes'];
      delete val['minCount_FP1'];
      delete val['minCount_FP2'];
      delete val['minCount_Changes'];
      delete val['maxCount_FP1'];
      delete val['maxCount_FP2'];
      delete val['maxCount_Changes'];
      delete val['query_FP1'];
      delete val['query_FP2'];
      delete val['query_Changes'];
      delete val['minTime_FP1'];
      delete val['minTime_FP2'];
      delete val['minTime_Changes'];
      delete val['maxTime_FP1'];
      delete val['maxTime_FP2'];
      delete val['maxTime_Changes'];
      delete val['_$visited'];
      
    });

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteriaStr,
      strSrcFileName: 'ComparedDBQueries',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.queryObjArr)
    };
    let downloadFileUrl = '';
   
      downloadFileUrl =  decodeURIComponent(this.getHostUrl(true) + '/' + this.globalQueryParams.product); 
   
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
   if(sessionStorage.getItem("isMultiDCMode") == "true"  && (downloadFileUrl.includes("/tomcat")|| downloadFileUrl.includes("/node")))
   this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
    (this.openDownloadReports(res)));
    else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
      (this.openDownloadReports(res)));
  }
     openDownloadReports(res) {
    console.log('file name generate ===', res);
    let downloadFileUrl = '';
   
      downloadFileUrl =  decodeURIComponent(this.getHostUrl(true));

    downloadFileUrl += '/common/' + res;
    window.open(downloadFileUrl);
  }
   setTestRunInHeader() {
    if (decodeURIComponent(this.globalQueryParams.ipWithProd).indexOf('netstorm') !== -1) {
      this.strTitle = 'Netstorm - Compared DBRequest - Test Run : ' + this.globalQueryParams.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - Compared DBRequest - Session : ' + this.globalQueryParams.testRun;
    }
  }

}
