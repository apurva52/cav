import { Component } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { NsCommonService } from '../../services/ns-common-service';
import { SessionDetailInterface } from '../interfaces/ns-session-info';
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { DDRRequestService } from '../../../../services/ddr-request.service';


@Component({
    selector: 'session-detail-report',
    templateUrl: 'session-detail-report.component.html',
    styleUrls: ['session-detail-report.component.scss']
})
export class SessionDetailReportComponent {
    [x: string]: any;
    id: any;
    thinkData=[];
    average;
    data: Array<SessionDetailInterface>;
    chartData: Object[];
    options: Object;
    options1: Object;
    thinkTime:any;
    percentThink;
    filterCriteria = '';
    loading = false;
    isCancelQuery: boolean = false;
    isCancelQuerydata: boolean = false;
    queryId:any;

    constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
        private _router: Router, private _cavConfigService: CavConfigService,
        private nsCommonData : NsCommonService ,private breadcrumbService: DdrBreadcrumbService,private _ddrData: DdrDataModelService,
        private ddrRequest:DDRRequestService) {

    }
    ngOnInit() {
        this.commonService.isToLoadSideBar=false;
        this.loading = true;
        this.randomNumber();
        this.id = this.commonService.getData();
        if(!this.nsCommonData.avgTime)
        this.nsCommonData.avgTime = sessionStorage.getItem("avgTime");
        this.average = this.nsCommonData.avgTime + "(hh:mm:ss.ms)";
        sessionStorage.removeItem("avgTime");
        sessionStorage.setItem("avgTime", this.nsCommonData.avgTime);
        this.getSessionDetailData();
        // this.thinkData.push({'avgHeader':'Think Duration','average':this.average,'percent':this.percentThink+'%'});
        console.log('think data ',this.thinkData);
    }
    getSessionDetailData() {
	if(!this.nsCommonData.currRowData || typeof this.nsCommonData.currRowData == "object")
                this.nsCommonData.scriptName = sessionStorage.getItem("scriptName");
        else
                this.nsCommonData.scriptName = this.nsCommonData.currRowData;

        let url = '';

        if(this.commonService.enableQueryCaching == 1){
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionDetail?cacheId='+ this.id.testRun + '&testRun=' + this.id.testRun;
        }
        else{
            url = this.getHostUrl() + '/' + this.id.product + '/v1/cavisson/netdiagnostics/ddr/sessionDetail?testRun=' + this.id.testRun;
        }
            
        url += '&startTime=' + this.id.startTime + '&endTime=' + this.id.endTime +
            '&objectType=3&status=-2&scriptName=' + this.nsCommonData.scriptName;

        if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        url += '&groupName=' +this._ddrData.vectorName;

        if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
        url += '&generatorName=' +this._ddrData.generatorName; 

        url += '&queryId='+this.queryId;

            sessionStorage.removeItem("scriptName");
            sessionStorage.setItem("scriptName" , this.nsCommonData.scriptName);
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

    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
      }
    doAssignValues(res: any) {
        console.log('Session Detail Data ', res);
        this.isCancelQuerydata = true;
        this.data = res.data;
        this.loading = false;
        this.thinkTime = res.thinkTime;
        this.percentThink = res.percentThink;
        setTimeout(() => {
            this.loading = false;
        }, 2000);
        this.createPieChart(this.data,this.thinkTime);
        this.showfilterCriteria(res.strStartTime,res.strEndTime);
        this.thinkData = this.Immutablepush(this.thinkData, {'avgHeader':'Think Duration','average':this.msToTimeFormate(this.thinkTime)+"(hh:mm:ss.ms)",'percent':this.percentThink+'%'})
         
    }

    createPieChart(data: any,time:any) {
        this.chartData = data;
        var dataArr = [];
        var barArr = [];
        dataArr.push({"name":"Think Time","y":Number(this.thinkTime),"color":"#f4720e"});
        for (let i = 0; i < this.chartData.length; i++) {
            dataArr.push({"name":this.chartData[i]["pageName"],"y":Number(this.chartData[i]["avgPageResp"])});
            barArr.push({"name":this.chartData[i]["pageName"],"data":[Number(this.chartData[i]["avgPageResp"])/1000]});
        }
        barArr.push({"name":"Think Time","data":[Number(this.thinkTime)/1000],"color":"#f4720e"});
        console.log('this.errArr******* ', dataArr)

        this.options = {
            chart : {
              type: "pie"
            },
            credits: {
              enabled :false
            },
            title :{
              text:"Session Detail Report", 
              // style:{'fontSize':'13px'}
            },
            legend :{
           itemWidth : 100
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
            },
            plotOptions:{
              pie:{
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels :{
                  enabled: true,
                  format: '<b>{point.name}</b>= {point.percentage:.2f} %'
                },
                showInLegend: true
              }
            },
            series :[
              {
                name: "Percentage",
                data:dataArr,
                enableMouseTracking: true
              }
            ]
      
          }
          // split time chart
          this.options1 = {
              chart : {
                  type: 'bar'
              },
              title : {
                  text : 'Time Split Chart (Seconds)'
              },
              xAxis : {
                  categories:['Time']
              },
              yAxis: {
                  min:0,
                  title:{
                      text:'Total Time Consumption'
                  }
              },
              credits:{
                  enabled:false
              },
              legend: {
                showInLegend: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            series:barArr
          }
    }

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



openPageReport(rowData: any) {    
    console.log("rowData>>>>>>>111-------"+JSON.stringify(rowData));
      this.nsCommonData.currRowData = rowData;
      this.nsCommonData.objectType = '3';
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.SESSION_DETAIL;
      this._router.navigate(['/home/ddr/nsreports/PageComponentDetail']);
     
      
    }

    showfilterCriteria(startTime: any, endTime: any, status?: string) {
        this.filterCriteria = "";
        if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
            this.filterCriteria += "DC=" + this._ddrData.dcName;
        if (this.nsCommonData.isSuccess)
            this.filterCriteria += ', Session Status= ' + this.nsCommonData.isSuccess;
        if (startTime !== 'NA' && startTime !== '' && startTime !== undefined)
            this.filterCriteria += ', From=' + startTime;
        if (endTime !== 'NA' && endTime !== '' && endTime !== undefined)
            this.filterCriteria += ', To=' + endTime;
        if (this.nsCommonData.scriptName)
            this.filterCriteria += ', Script= ' + this.nsCommonData.scriptName;
            
		if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
        this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;

        if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
        this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;


        if (this.filterCriteria.trim().startsWith(',')) {
            this.filterCriteria = this.filterCriteria.trim().substring(1);
        }
    }

    customsortOnColumns(event, tempData) {
        if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1
            console.log('temp datattaaa ', temp);
            tempData = tempData.sort(function (a, b) {
                var value = Number(a[temp].replace(/[:.,]/g, ''));
                var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            var temp = (event["field"]);
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                var value = Number(a[temp].replace(/[:.,]/g, ''));
                var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }
        this.data = [];
        //console.log(JSON.stringify(tempData));
        if (tempData) {
            tempData.map((rowdata) => { this.data = this.Immutablepush(this.data, rowdata) });
        }

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
