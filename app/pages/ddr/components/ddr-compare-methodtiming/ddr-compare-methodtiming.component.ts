import { Component, OnInit,Input,OnChanges,SimpleChanges } from '@angular/core';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
import { CavConfigService } from "../../../tools/configuration/nd-config/services/cav-config.service";
import { CavTopPanelNavigationService } from "../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service";
import {HttpClient} from '@angular/common/http';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DDRRequestService } from '../../services/ddr-request.service';
import { MessageService } from '../../services/ddr-message.service';
import { Message } from 'primeng/api';
import { timeout } from 'rxjs/operators';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-ddr-compare-methodtiming',
  templateUrl: './ddr-compare-methodtiming.component.html',
  styleUrls: ['./ddr-compare-methodtiming.component.css']
})
export class DdrCompareMethodtimingComponent implements OnChanges {
highcharts = Highcharts;
@Input('compareFPInfo') compareFPInfo:any[];
globalQueryParams:any;
loading:boolean=false;
 MTObjArr:any[]=[];
 cumSelfTimeArr:Object[]=[];
 avgSelfTimeArr:Object[]=[];
 avgCPUSelfTimeArr:Object[]=[];
 countArr:Object[]=[];
 options:Object;
 options1:Object;
 options2:Object;
 options3:Object;
 compareMTData:Object;
 colour:string[]=[];
 fQM:string="";
 fqmstr = "";
 Completefqm = "";
 errMsg: Message[];
 strTitle:string='';
 filterCriteriaStr :string="";
  constructor(private commonServices:CommonServices,private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService,private http:HttpClient
    ,private _ddrData : DdrDataModelService, private ddrRequest:DDRRequestService, private messageService: MessageService) {
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
    let com_MT_url ='';
    let testRun;
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
          cmdArgs+=testRun+","+this.compareFPInfo[i]['startTimeInMs']+","+endTime+","+this.compareFPInfo[i]['urlIndex']+","+this.compareFPInfo[i]['tierId']+","+this.compareFPInfo[i]['serverId']+","+this.compareFPInfo[i]['appId']+","+this.compareFPInfo[i]['flowpathInstance']+",%%%,";
        }
        console.log("commandargs",cmdArgs);
        let url;
        if (this.commonServices.host != undefined && this.commonServices.host != '' && this.commonServices.host != null) {
          if (this.commonServices.protocol && this.commonServices.protocol.endsWith("://"))
            url = this.commonServices.protocol + this.commonServices.host + ':' + this.commonServices.port;
          else if (this.commonServices.protocol)
            url = this.commonServices.protocol + "://" + this.commonServices.host + ':' + this.commonServices.port;
          else
            url = "// " + this.commonServices.host + ':' + this.commonServices.port;
        }
        else {
          url = this.getHostUrl();
        }
        if(this.commonServices.enableQueryCaching == 1){
          com_MT_url=url+ '/' + this.globalQueryParams.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/compareFPMethods?cacheId="+ testRun + "&cmdArgs="+cmdArgs;
        }
        else{
          com_MT_url=url+ '/' + this.globalQueryParams.product.replace("/","") + "/v1/cavisson/netdiagnostics/ddr/compareFPMethods?cmdArgs="+cmdArgs;
        }

         this.ddrRequest.getDataUsingGet(com_MT_url).pipe(timeout(this.commonServices.ajaxTimeOut)).subscribe(
    data => {(this.doAssignValuForCompareMTdata(data))},
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
 doAssignValuForCompareMTdata(data)
 {
    this.loading=false;
    this.assignCompareMTData(data);
  this.compareMTData=data;
    if(this.MTObjArr.length >0)
    {
     this.getBarChartsDataBasedOnFQM(this.MTObjArr[0]['fQM']);
    this.createCumSelfTimeBarChart();
    this.createAvgSelfTimeBarChart();
    this.createAvgCPUSelfTimeBarChart();
    this.createCountBarChart();
    }
 }

 getBarChartsDataBasedOnFQM(fQM:string)
 {
   console.log("query value---",fQM)
   this.fQM=fQM;
    if (this.fQM.length > 40) {
     this.fqmstr = this.fQM.substring(0, 40) + "...";
     this.Completefqm = this.fQM;
   }
   else {
     this.fqmstr = this.fQM;
     this.Completefqm = this.fQM;	
   }	
   var arr=this.compareMTData[fQM];
   let cumSelfTimeArr=[];
   let avgSelfTimeArr=[];
   let avgCPUSelfTimeArr=[];
   let countArr=[];
   arr.forEach((val,index)=>{
       if(arr.length > (index+1))
           {
             if(val['total_cpu_self_time_in_ns'] !== -9999.0)
     cumSelfTimeArr.push({"name":"FP"+(index+1),"y":val['total_cpu_self_time_in_ns'],color:this.colour[index]});
     if(val['avgselftime'] !== -9999.0)
     avgSelfTimeArr.push({"name":"FP"+(index+1),"y":val['avgselftime'],color:this.colour[index]});
     if(val['avg_cpu_self_time_in_ms'] !== -9999.0)
     avgCPUSelfTimeArr.push({"name":"FP"+(index+1),"y":val['avg_cpu_self_time_in_ms'],color:this.colour[index]});
     if(val['executionCount'] !== -9999.0)
     countArr.push({"name":"FP"+(index+1),"y":val['executionCount'],color:this.colour[index]});
           }
   });
   this.cumSelfTimeArr=cumSelfTimeArr;
   this.avgSelfTimeArr=avgSelfTimeArr;
   this.avgCPUSelfTimeArr=avgCPUSelfTimeArr;
   this.countArr=countArr;
 }
 createCountBarChart()
 {
   let countArr=this.countArr;
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
          text: 'Count'
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
          data: countArr
  }]
                };
 }
 showMTrelatedData(node)
 {
    //console.log(node);
    this.fQM=node['fQM'];
     this.getBarChartsDataBasedOnFQM(node['fQM']);
    this.createCumSelfTimeBarChart();
    this.createAvgSelfTimeBarChart();
    this.createAvgCPUSelfTimeBarChart();
    this.createCountBarChart();
 }
 createAvgCPUSelfTimeBarChart()
 {
    let avgCPUSelfTimeArr=this.avgCPUSelfTimeArr;
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
          text: 'AvgCPUSelfTime(ms)'
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
          data: avgCPUSelfTimeArr
  }]
                };
 }
 createAvgSelfTimeBarChart()
 {
   let avgSelfTimeArr=this.avgSelfTimeArr;
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
          text: 'AvgSelfTime(ms)'
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
          data: avgSelfTimeArr
  }]
                };
 }
 assignCompareMTData(data)
 {
     var MTObjArr=[];
    let compMTArr=Object.keys(data);
    compMTArr.forEach((val,ind)=> {
        let MTObj={};
           let compMTDataArr=data[val];
          
           let compMTDataLength=compMTDataArr.length;
           let lastIndex = val.lastIndexOf(".");
        let temp = val.substring(0,lastIndex);
        let secondLastindex = temp.lastIndexOf(".");
           MTObj['fQM']=val;
            MTObj['mN']=val.substring(lastIndex+1,val.length);
             MTObj['cN']= temp.substring(secondLastindex+1,temp.length);
              MTObj['pN']=temp.substring(0,temp.lastIndexOf("."));
           compMTDataArr.forEach((val1,index)=>{
            
             if(compMTDataLength == (index+1))
           {
              var objectKeys=Object.keys(val1);
             objectKeys.forEach((val2,index2)=>{
                if(val1[val2]!= "-9999" && val1[val2] != "-9999.0")
                MTObj[val2+"_Changes"]=this.formatter(Number(val1[val2]).toFixed(3));
                else
                 MTObj[val2+"_Changes"]="-";
             });
           }
           else
           {
             var objectKeys=Object.keys(val1);
             objectKeys.forEach((val2,index2)=>{
                 if(val1[val2]!= "-9999" && val1[val2] != "-9999.0")
                MTObj[val2+"_FP"+(index+1)]=this.formatter(val1[val2]);
                else
                 MTObj[val2+"_FP"+(index+1)]="-";
             });
           }
           });
           console.log(MTObj);
           MTObjArr.push(MTObj);  
    });
      console.log(MTObjArr);
    this.MTObjArr=MTObjArr;
 }
  formatter(data: any) {
    if(Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }
createCumSelfTimeBarChart()
{
  let cumSelfTimeArr=this.cumSelfTimeArr;
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
          text: 'CumCPUSelfTime(sec)'
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
          data: cumSelfTimeArr
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
      if(!isDownloadCase &&sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
      { 
        //hostDcName = this._ddrData.protocol + "://"+ this._ddrData.host + ':' +this._ddrData.port ;
      //  this.testRun=this._ddrData.testRun;
       // this.urlParam.testRun= this._ddrData.testRun;
        console.log("all case url==>",hostDcName,"all case test run==>", "hostDcName---",hostDcName);
      }
    //  else if (this._navService.getDCNameForScreen("methodCallingTree") === undefined)
    //     hostDcName = this._cavConfigService.getINSPrefix();
    //   else
    //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("methodCallingTree");

    //   if (hostDcName.length > 0) {
    //     sessionStorage.removeItem("hostDcName");
    //     sessionStorage.setItem("hostDcName", hostDcName);
    //   }
    //   else
    //     hostDcName = sessionStorage.getItem("hostDcName");
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
      'mN': 'Method', 'avgselftime_FP1': 'AvgSelftime(ms)_FP1', 'avgselftime_FP2': 'AvgSelftime(ms)_FP2',
      'avgselftime_Changes': 'AvgSelftime(ms)_Changes', 'avg_cpu_self_time_in_ms_FP1': 'AvgCpuSelfTime(ms)_FP1', 'avg_cpu_self_time_in_ms_FP2': 'AvgCpuSelfTime(ms)_FP2','avg_cpu_self_time_in_ms_Changes': 'AvgCpuSelfTime(ms)_Changes',
      'executionCount_FP1': 'Count_FP1', 'executionCount_FP2': 'Count_FP2','executionCount_Changes': 'Count_Changes','total_cpu_self_time_in_ns_FP1':'CumCpuSelfTime(sec)_FP1','total_cpu_self_time_in_ns_FP2': 'CumCpuSelfTime(sec)_FP2',
      'total_cpu_self_time_in_ns_Changes': 'CumCpuSelfTime(sec)_Changes'
    };
     colOrder = [
      'Method', 'AvgSelftime(ms)_FP1', 'AvgSelftime(ms)_FP2', 'AvgSelftime(ms)_Changes', 'AvgCpuSelfTime(ms)_FP1', 'AvgCpuSelfTime(ms)_FP2',
      'AvgCpuSelfTime(ms)_Changes', 'Count_FP1', 'Count_FP2', 'Count_Changes', 'CumCpuSelfTime(sec)_FP1', 'CumCpuSelfTime(sec)_FP2', 'CumCpuSelfTime(sec)_Changes'
    ];
    this.MTObjArr.forEach((val, index) => {
      delete val['fQM'];
      delete val['cN'];
      delete val['pN'];
      delete val['id_FP1'];
      delete val['colID_FP1'];
      delete val['entityName_FP1'];
      delete val['fg_FP1'];
      delete val['variance_FP1'];
      delete val['id_FP2'];
      delete val['colID_FP2'];
      delete val['entityName_FP2'];
      delete val['fg_FP2'];
      delete val['variance_FP2'];
      delete val['id_Changes'];
      delete val['colID_Changes'];
      delete val['entityName_Changes'];
      delete val['fg_Changes'];
      delete val['variance_Changes'];
      delete val['_$visited'];
      delete val['total_wall_time_in_msi_FP1'];
      delete val['total_wall_time_in_msi_FP2'];
      delete val['total_wall_time_in_msi_Changes'];
       delete val['avg_total_wall_time_in_msi_FP1'];
      delete val['avg_total_wall_time_in_msi_FP2'];
      delete val['avg_total_wall_time_in_msi_Changes'];
       delete val['total_self_time_in_ms_FP1'];
      delete val['total_self_time_in_ms_FP2'];
      delete val['total_self_time_in_ms_Changes'];
       delete val['total_cpu_time_in_ns_FP1'];
      delete val['total_cpu_time_in_ns_FP2'];
      delete val['total_cpu_time_in_ns_Changes'];
      
    });

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filterCriteriaStr,
      strSrcFileName: 'ComparedMethodTiming',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.MTObjArr)
    };
    let downloadFileUrl = '';
   
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.globalQueryParams.product); 
   
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';

    if(sessionStorage.getItem("isMultiDCMode") == "true"  && (downloadFileUrl.includes("/tomcat")|| downloadFileUrl.includes("/node")))
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
     (this.openDownloadReports(res)));
     else
     this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
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
      this.strTitle = 'Netstorm - Compared MethodTiming - Test Run : ' + this.globalQueryParams.testRun;
    } else {
      this.strTitle = 'Netdiagnostics Enterprise - Compared MethodTiming - Session : ' + this.globalQueryParams.testRun;
    }
  }

}
