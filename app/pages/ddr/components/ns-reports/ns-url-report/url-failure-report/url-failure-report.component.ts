import { Component, Input, OnInit } from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { SelectItem } from '../../../../interfaces/selectitem';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NsCommonService } from '../../services/ns-common-service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { DDRRequestService } from '../../../../services/ddr-request.service';


@Component({
  selector: 'app-url-failure-report',
  templateUrl: './url-failure-report.component.html',
  styleUrls: ['./url-failure-report.component.css']
})
export class UrlFailureReportComponent implements OnInit {
  toolTipStatus: string = "";
  failureFilter: string;
  url: any;                                           //url for ajaxcall
  cols: any;
  options: any;
  visibleCols: any[];
  urlFailureData: any;
  commonParams: any;
  urlidx = this.nsCommonData.urlidx;
  filter:any;
  loading = false;
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;

  constructor(private _router: Router, private ddrData: DdrDataModelService,
    public commonService: CommonServices, private breadcrumbService: DdrBreadcrumbService, private _cavConfigService: CavConfigService,
    private _navService: CavTopPanelNavigationService, private nsCommonData: NsCommonService,private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.commonService.isToLoadSideBar=false;
    this.loading = true;
    this.commonParams = this.commonService.getData();
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.URL_FAIL);
    this.commonService.currentReport = "URL Failure";
    this.randomNumber();
    this.commonService.checkForNsKeyObj(this.ddrData.nsCQMFilter, this.commonService.currentReport);
    console.log("this.commonservice.nsURLSummary==>", this.commonService.nsURLFailure);
    this.makeajaxcall();
    console.log("inside fail");
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this.ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.commonParams.testRun = this.ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.commonParams.testRun);
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  makeajaxcall() {
      let startTime = this.commonParams.startTime;
      let endTime = this.commonParams.endTime;
      this.url = this.getHostUrl();
      let ajaxParam='';
      if(this.commonService.enableQueryCaching == 1){
        this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?cacheId='+ this.commonParams.testRun + '&testRun=' + this.commonParams.testRun;
      }
      else{
        this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?testRun=' + this.commonParams.testRun;
      }
      ajaxParam += '&object=0&statusCode=-1' + '&startTime=' + startTime + '&endTime=' + endTime + '&reportType=failure' + '&strStatusName=NA' + '&objid=' + this.urlidx;
 
        if (this.ddrData.nsErrorName){
             ajaxParam +='&nsErrorName=' + this.ddrData.nsErrorName;
        } 
      if(this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
      ajaxParam += '&groupName=' +this.ddrData.vectorName;
     if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
     ajaxParam += '&generatorName=' +this.ddrData.generatorName;
	  
      //object = 0 is for URL Report
      console.log("url", this.url);
      // if(this.nsCommonData.urlsessionsummarydata != undefined)
      //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
      
        if(this.commonService.isFromUrlSummary || this.commonService.isFromUrlSession)
        {
            if(this.commonService.nsURLFailure['objid'])
            {
              delete this.commonService.nsURLFailure['url'];
            }
            console.log("inside data of url instance==>",this.ddrData.nsCQMFilter);
            // this.commonService.nsTransactionInstance=this.ddrData.nsCQMFilter[this.commonService.currentReport];
             ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsURLFailure,true);
             this.ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsURLFailure;
             console.log("this.ddrData.nsCQMFilter in data call==>",this.ddrData.nsCQMFilter);
             console.log("ajax param are==>",ajaxParam);
           }
           else if (this.ddrData.nsCQMFilter[this.commonService.currentReport]) {
            this.commonService.isFromUrlSummary=true;
            this.commonService.isFromUrlSession=true;
             console.log("inside else cond===> ",this.ddrData.nsCQMFilter[this.commonService.currentReport])
             ajaxParam = this.commonService.makeParamStringFromObj(this.ddrData.nsCQMFilter[this.commonService.currentReport], true);
           }
     
    if (this.nsCommonData.urlsessionsummarydata != undefined)
      ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;

        this.url+=ajaxParam +'&limit=22&offset=0&showCount=false' + '&queryId='+this.queryId ;
        console.log("FINAL url========>",this.url);
        setTimeout(() => {
          this.openpopup();
         }, this.ddrData.guiCancelationTimeOut);
    
        this.ddrRequest.getDataUsingGet(this.url).subscribe(data => { (this.AssignData(data)) });
    }

  
    AssignData(res) {
      this.isCancelQuerydata = true;
      console.log("res in assign data", JSON.stringify(res));
      this.urlFailureData = res.data;
      this.loading = false;
      this.filtercriteria(res.starttime,res.endtime);
      this.createTable();
      this.createStackBarChart(this.urlFailureData);
    }

    filtercriteria(startTime,endTime){
      this.filter = "";
      this.failureFilter = "";
      this.toolTipStatus = "";
      if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filter += "DC=" + this.ddrData.dcName;
      if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
      this.filter += ', From=' + startTime;
    }
      if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
        this.filter += ', From=' + startTime;
      }
      if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
        this.filter += ', To=' + endTime;
      }
      if (this.nsCommonData.urlfaildata!=undefined)
      {
        this.filter += ', URL=' + this.nsCommonData.urlfaildata.urlName;
      }
      if(this.nsCommonData.urlsessionsummarydata != undefined)
      {
        this.filter += ', Script Name=' + this.nsCommonData.urlsessionsummarydata.scriptName + ', Page Name=' + this.nsCommonData.urlsessionsummarydata.pageName + ', URL=' + this.nsCommonData.urlsessionsummarydata.urlName;
      }
      //if (this.nsCommonData.urlfaildata!=undefined)
      //{
      //  this.filter += ', URL Status= All Failures';
     //  }
      if (this.commonService.nsURLFailure && this.commonService.nsURLFailure['statusCodeFC']) {
        let status = this.commonService.nsURLFailure['statusCodeFC'];
        console.log('status of fail', status);
        if (status && status.length >= 20) {
          this.toolTipStatus = status;
          status = status.substring(0, 19);
          this.failureFilter += ", URL Status=" + status + " ....";
        }
        else
          this.failureFilter += ', URL Status=' + status;
      }
      else if (this.ddrData.nsErrorName) {
        this.failureFilter += ', URL Status=' + this.ddrData.nsErrorName;
      }
      else {
        this.failureFilter += ', URL Status= All Failures';
      }
      if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
      {
        this.filter += ', Generator Name=' +this.ddrData.generatorName;      
      }
      if(this.ddrData.vectorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
      {
        this.filter += ', Group Name=' +this.ddrData.vectorName;
      }

      if (this.filter.startsWith(',')) {
        this.filter = this.filter.substring(1);
      }
      if (this.filter.endsWith(',')) {
        this.filter = this.filter.substring(0, this.filter.length - 1);
      }
    }
  
  
  
    /**Used to create stacked Column chart based on FailureCount */
    createStackBarChart(stackData) {
      console.log("in bar", Number(stackData[0].failures));
      let failurearr = [];
      for (let i = 0; i < stackData.length; i++) {
        failurearr.push({ "name": stackData[i]["errorname"], "data": [Number(stackData[i].failures)] });
      }
      //console.log("bar dataaaaaaaaa",failurearr);
      this.options = {
        chart: {
          type: "column"
        },
        credits: {
          enabled: false
        },
        title: {
          text: "Failure Detail Report For URL",
          style: { 'fontSize': '20px' }
        },
        xAxis: {
          title: {
            text: 'Number of Failures'
          },
          // categories: ['Failure Type']
  
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Number of Failures'
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: 'gray'
            }
          }
        },
        legend: {
          align: 'center',
          floating: false,
          backgroundColor: 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: true
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, Count: <b> {point.y}</b>'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            pointWidth: 50,
            dataLabels: {
              enabled: true,
              color: 'white'
            },
            showInLegend: true
          }
        },
        series: failurearr
  
      };
    }
  
    URLInstanceReport(row) {
      console.log("function data ---------", row);
      this.commonService.nsURLInstance={}; // for in case if user apply filter in instance then go back in summary then goes to instance. 
      // then the object will still be remaining there therefore will oopen up same data of instance again. for bug :68564
      console.log("inside url instance ==>",this.commonService.nsURLSummary , " instacne ",this.commonService.nsURLInstance," nsCQM ** ",this.ddrData.nsCQMFilter["URL Instance"]);
      this.ddrData.nsCQMFilter["URL Instance"]=undefined;
      this.ddrData.summaryToInstanceFlag = 'true';
      this.nsCommonData.urlidx = this.nsCommonData.urlidx;
      this.nsCommonData.FailureStatus = row.failuretype;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_FAIL;
      this.nsCommonData.urlInstancethroughsuccess = false;
     if(this.commonService.isFromUrlSummary ||this.commonService.isFromUrlSession)
     {
      console.log("inside of cqm cond==>",this.commonService.nsURLFailure);
      this.commonService.nsURLInstance=JSON.parse(JSON.stringify(this.commonService.nsURLFailure));
      this.commonService.nsURLInstance['reportType']='instance';
      delete this.commonService.nsURLInstance['fields'];
       if (this.commonService.isFromUrlSession || this.commonService.isFromUrlSummary ) {
         this.commonService.nsURLInstance['urlidx'] = this.commonService.nsURLInstance['objid'];
         delete this.commonService.nsURLInstance['objid'];
        console.log("chnaged objid to url id")
        }
         console.log("this.commonService.nsURLInstance['urlidx']=>",this.commonService.nsURLInstance['urlidx']);
       this.commonService.nsURLInstance['statusCode']=row.failuretype;
      if (this.commonService.nsURLInstance['urlidx'] && (this.nsCommonData.urlidx =='undefined' || this.nsCommonData.urlidx)) {
        this.commonService.nsURLInstance['urlidx']=this.nsCommonData.urlidx;
        console.log("sessting default==>",this.commonService.nsURLInstance['urlidx']);
      }
      // if (this.nsCommonData.urlInstancethroughsuccess)
      // this.commonService.nsURLInstance['statusCode']=0;
      console.log("this.commonService.nsURLInstance==> going ourt of summary=====>",this.commonService.nsURLInstance);
      // if (this.nsCommonData.urlsessionsummarydata != undefined) {
        //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
        // }
        
        this.commonService.isFromUrlFailure=true;
      }
      this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'URL Instance');
      this.ddrData.nsFromGraph = false;
      this._router.navigate(['/home/ddr/nsreports/urlInstance']);
    }
  
    createTable() {
  
      this.cols = [
        { field: 'errorname', header: 'Failure Type', sortable: true, action: true },
        { field: 'failures', header: 'Number Of Failures', sortable: true,color: 'blue', action: true }
      ];
  
  
      this.visibleCols = ['errorname', 'failures'];
    }
   
    getSelected(event) {
    }
    ngOnDestroy(): void {
    this.commonService.isFromUrlSummary=false;
    this.commonService.isFromUrlSession=false;
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
}, this.ddrData.guiCancelationTimeOut);
}

onCancelQuery(){
    let url = "";
   url = decodeURIComponent(this.getHostUrl() + '/' + this.commonParams.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.commonParams.testRun +"&queryId="+this.queryId;  
  console.log("Hello u got that",url);
    this.isCancelQuery = false;
     this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
  }

  openpopup(){
    if(!this.isCancelQuerydata)
    this.isCancelQuery =true;
  }
  }
