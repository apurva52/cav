import { Component, Input, OnInit,ViewChild } from '@angular/core';
import * as  CONSTANTS from '../../../../constants/breadcrumb.constants';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DdrBreadcrumbService } from '../../../../services/ddr-breadcrumb.service';
import { SelectItem } from '../../../../interfaces/selectitem';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CommonServices } from '../../../../services/common.services';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { DdrDataModelService } from '../../../../../../main/services/ddr-data-model.service';
import { NsCommonService } from '../../services/ns-common-service';
import { DDRRequestService } from '../../../../services/ddr-request.service';
import { Subscription } from 'rxjs';
import {Message} from'primeng/primeng';
@Component({
  selector: 'app-url-summary-report',
  templateUrl: './url-summary-report.component.html',
  styleUrls: ['./url-summary-report.component.css']
})
export class UrlSummaryReportComponent implements OnInit {
  @Input() urlSummaryStatus: boolean;                      //flag_to_check_if_from_URLSUMMARYSTATUS
  @ViewChild("paginateRef") paginateRef :any;
  strGroupBy: any = "";                                    //passed in url in case of URLSUMMARYSTATUS
  url: any;                                                //url for ajaxcall
  commonParams: any;                                       //parameters from common service
  limit: number = 50;
  offset: number = 0;
  cols: any;
  visibleCols: any[];
  columnOptions: SelectItem[]; 
  urlSummaryData: any;  
  urlSummaryDownloadData: any;                  
  urlindex: any;
  count: any;
  filter = "";
  loading = false;
  showAllOption = false;
  prevColumn;
  strTitle:any;
  isEnabledColumnFilter = true;
  toggleFilterTitle = '';
  commonUrl = '' ;
  screenHeight:any;
  subscribeURL: Subscription;
  toolTipStatus: string='';
  toolTipUrl: string='';
  filterStatus: string='';
  filterUrl: string='';
  renameArray: any;
  colOrder: any;
  width:number;
  msgs: Message[] = [];
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  value: number;
  loader: boolean;
  constructor(private _router: Router, private breadcrumbService: DdrBreadcrumbService,
    public commonService: CommonServices, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private ddrData: DdrDataModelService, private nsCommonData: NsCommonService,
    private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.loading = true;
    this.screenHeight = Number(this.commonService.screenHeight)-94;   
    this.commonParams = this.commonService.getData();
    this.commonService.isToLoadSideBar = true;
    this.commonService.currentReport = 'URL Summary' ;
    this.randomNumber();
    this.setTestRunInHeader();
    if (this.urlSummaryStatus)
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY_STATUS);
    else
      this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY);
    
      this.commonService.checkForNsKeyObj(this.ddrData.nsCQMFilter,this.commonService.currentReport);
      console.log("this.commonservice.nsURLSummary==>",this.commonService.nsURLSummary); 
  
    this.subscribeURL=this.commonService.sideBarUIObservable$.subscribe((temp) => {
      if (this.commonService.currentReport == 'URL Summary') {
        this.loading = true;
        this.limit = 50;
        this.offset=0;
        console.log("this.paginateRef===>", this.paginateRef)
        let length = this.paginateRef['pageLinkSize'];
        let arry = [];
        for (let i = 1; i <= length; i++)
          arry.push(i);
        this.paginateRef['pageLinks'] = [];
        this.paginateRef['pageLinks'] = arry;
        this.paginateRef['_rows'] = 50;
        this.paginateRef['_first'] = 0;
        this.makeajaxcall();
        this.makeajaxcallCount();
      }
    })

    this.makeajaxcall();
    this.makeajaxcallCount();
    this.ddrData.passMesssage$.subscribe((mssg)=>{ this.showMessage(mssg)});
  }


  setTestRunInHeader(){
    if (this.commonParams && this.commonParams.product.toLowerCase() == 'netstorm') {
      if(this.urlSummaryStatus )
      this.strTitle = 'Netstorm - Url Summary By Status Report - Test Run : ' + this.commonParams.testRun;
      else
      this.strTitle = 'Netstorm - Url Summary Report - Test Run : ' + this.commonParams.testRun;
    }
    else if(this.commonParams && this.commonParams.product.toLowerCase() == 'netcloud'){
      if(this.urlSummaryStatus )
      this.strTitle = 'NetCloud - Url Summary By Status Report - Test Run : ' + this.commonParams.testRun;
      else
      this.strTitle = 'NetCloud - Url Summary Report - Test Run : ' + this.commonParams.testRun;
    }
    else {
      if(this.urlSummaryStatus )
      this.strTitle = 'Netdiagnostics Enterprise - Url Summary By Status Report - Session : ' + this.commonParams.testRun;
      else
      this.strTitle = 'Netdiagnostics Enterprise - Url Summary Report - Session : ' + this.commonParams.testRun;
    }
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
    let ajaxParam = '' ;
    this.url = "";
    if (this.urlSummaryStatus)
      this.strGroupBy = "status";
    let startTime = this.commonParams.startTime;
    let endTime = this.commonParams.endTime;
    this.url = this.getHostUrl();
    if(this.commonService.enableQueryCaching == 1){
      this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?cacheId='+ this.commonParams.testRun + '&testRun=' + this.commonParams.testRun;
    }
    else{
      this.url += '/' + this.commonParams.product + '/v1/cavisson/netdiagnostics/ddr/nsUrlReport?testRun=' + this.commonParams.testRun;
    }

    if (this.commonService.isFilterFromNSSideBar && Object.keys(this.commonService.nsURLSummary).length!=0) {
      if (this.urlSummaryStatus)
      {
        console.log(this.commonService.nsURLSummary)
        let group=[]
       // group.push(this.commonService.nsURLSummary['strGroupBy']);
       group = this.commonService.nsURLSummary['strGroupBy'];
        if( group[0]=='' || group[0]==undefined)
        { 
          group[0]='status';
        }
        this.commonService.nsURLSummary['strGroupBy']=group;
      }
      this.commonService.isCQM=true;
      let param = this.commonService.nsURLSummary;
      ajaxParam = this.commonService.makeParamStringFromObj(param);
           // for FIlter CQM case    so that will update value in key pair.
           this.ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsURLSummary;
   }
    else {
      ajaxParam = '&object=0&fields=4095&statusCode=-2' + '&startTime=' + startTime + '&endTime=' + endTime + '&strGroupBy=' + this.strGroupBy + '&reportType=summary' + '&strStatusName=NA';

      // if(this.ddrData.groupName=="HTTP Requests"  && this.ddrData.vectorName!='undefined'&& this.ddrData.vectorName!=undefined )
      // ajaxParam += '&url=' + this.ddrData.vectorName;

      if (this.ddrData.nsErrorName){
        ajaxParam +='&nsErrorName=' + this.ddrData.nsErrorName ;
      }
      if(this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
      ajaxParam += '&groupName=' +this.ddrData.vectorName;
      if(this.ddrData.generatorName || (this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
      ajaxParam += '&generatorName=' +this.ddrData.generatorName;
 
     //object = 0 is for URL Report 
      //this.commonService.nsURLSummary = this.commonService.makeObjectFromUrlParam(ajaxParam)
    }
    
    if(this.commonService.isCQM)
    {
      console.log("inside data of url summary==>",this.ddrData.nsCQMFilter);
      //this.commonService.nsTransactionSummary=this.ddrData.nsCQMFilter[this.commonService.currentReport];
      ajaxParam=this.commonService.makeParamStringFromObj(this.commonService.nsURLSummary,true);
      this.ddrData.nsCQMFilter[this.commonService.currentReport]=this.commonService.nsURLSummary;
      console.log("this.ddrData.nsCQMFilter in data call==>",this.ddrData.nsCQMFilter);
      console.log("ajax param are==>",ajaxParam);
    }
    else if (this.ddrData.nsCQMFilter[this.commonService.currentReport]) {
      this.commonService.isCQM=true;
      console.log("inside else cond===> ",this.ddrData.nsCQMFilter[this.commonService.currentReport])
      ajaxParam = this.commonService.makeParamStringFromObj(this.ddrData.nsCQMFilter[this.commonService.currentReport], true);
    }
    this.commonService.nsURLSummary = this.commonService.makeObjectFromUrlParam(ajaxParam);
    this.commonUrl = this.url + ajaxParam ;
    console.log("url", this.url);
    let finalUrl = this.commonUrl + '&limit=' + this.limit + '&offset=' + this.offset + '&showCount=false' + '&queryId='+this.queryId ;
    setTimeout(() => {
      this.openpopup();
     }, this.ddrData.guiCancelationTimeOut);

    this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => { (this.assignData(data)) });
  }

  assignData(res) {
    this.isCancelQuerydata = true;
    this.commonService.isFilterFromNSSideBar = false ;
   // console.log("res data in url-summary-report ", JSON.stringify(res));
    this.urlSummaryData = res.data;
    setTimeout(() => {
      this.loader = false;
    }, 2000);
    this.loading = false;
    this.filtercriteria(res.starttime, res.endtime);
    this.commonService.customTimePlaceHolder=[];
    this.commonService.customTimePlaceHolder.push(res.starttime, res.endtime);
    this.createTable();
    this.changeColumnFilter();
  }

  filtercriteria(startTime, endTime) {
    this.filter = "";
    this.toolTipStatus='';
    this.toolTipUrl='';
    this.filterStatus='';
    this.filterUrl=''; 
    let urlSummaryHeader = JSON.parse(JSON.stringify(this.commonService.nsURLSummary)) ;
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
    this.filter += "DC=" + this.ddrData.dcName;
    }
    if (!this.commonService.isValidParamInObj(urlSummaryHeader, 'phaseName')) {
      if (startTime !== 'NA' && startTime !== '' && startTime !== undefined) {
        this.filter += ', From=' + startTime;
      }
      if (endTime !== 'NA' && endTime !== '' && endTime !== undefined) {
        this.filter += ', To=' + endTime;
      }
    } 
    
    if(this.ddrData.generatorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filter += ', Generator Name=' +this.ddrData.generatorName;

    if(this.ddrData.vectorName && this.ddrData.vectorMetaData && this.ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filter += ', Group Name=' +this.ddrData.vectorName;

    if (this.commonService.isValidParamInObj(urlSummaryHeader, "url")) {
     
        let url=decodeURIComponent(JSON.parse(JSON.stringify(urlSummaryHeader['url']))); 
        if (url && (url.length>=20))
        {
          this.toolTipUrl+=url;
          this.filterUrl += ", Url=" + url.substring(0,19) + " ..." ; 
        }
        else
        this.filterUrl += ", Url=" + url ;
      }
    if (this.commonService.isValidParamInObj(urlSummaryHeader, "pageName")) {
      this.filter += ', Page=' + urlSummaryHeader['pageName'];
    }

    if (this.commonService.isValidParamInObj(urlSummaryHeader, "scriptName")) {
      this.filter += ', Script=' + urlSummaryHeader['scriptName'];
    }

    if (this.commonService.isValidParamInObj(urlSummaryHeader, "transactionName")) {
      this.filter += ', Transaction=' + urlSummaryHeader['transactionName'];
    }

    if (this.commonService.isValidParamInObj(urlSummaryHeader, "location")) {
      this.filter += ', Location=' + urlSummaryHeader['location'];
    }
    
    if (this.commonService.isValidParamInObj(urlSummaryHeader, "browser")) {
      this.filter += ', Browser=' + urlSummaryHeader['browser'];
    }

    if (this.commonService.isValidParamInObj(urlSummaryHeader, "access")) {
      this.filter += ', Access=' + urlSummaryHeader['access'];
    }

    
    if (this.commonService.isValidParamInObj(urlSummaryHeader, 'statusCodeFC')) {
      let status = urlSummaryHeader['statusCodeFC'];
      if (status && status.length >= 20) {
        this.toolTipStatus += urlSummaryHeader['statusCodeFC'];
        status = status.substring(0, 19);
        this.filterStatus += ", Status=" + status+ " ....";  
      }
      else
      this.filterStatus += ", Status=" + status;

    }
    // this.filter += ', Status =' + urlSummaryHeader['statusCodeFC'];
    if (this.commonService.isValidParamInObj(urlSummaryHeader, 'strGroupBy'))
      this.filter += ", group=" + urlSummaryHeader.strGroupBy
    if (this.commonService.isValidParamInObj(urlSummaryHeader, 'order'))
      this.filter += ", order=" + urlSummaryHeader.order
      if (this.commonService.isValidParamInObj(urlSummaryHeader, 'phaseName'))
      this.filter += ", Phase Name=" + urlSummaryHeader.phaseName;

    if (this.filter.startsWith(',')) {
      this.filter = this.filter.substring(1);
    }
    if (this.filter.endsWith(',')) {
      this.filter = this.filter.substring(0, this.filter.length - 1);
    }
    console.log("url=========>>>",this.commonService.nsURLSummary);
  }

  makeajaxcallCount() {
    let countUrl = this.commonUrl + '&showCount=true';
    this.ddrRequest.getDataUsingGet(countUrl).subscribe(data => { (this.assignCountData(data)) });
  }

  assignCountData(countdata) {
    this.count = countdata.totalCount;
    if (this.limit > this.count)
      this.limit = Number(this.count);
    console.log("countdata", countdata);
  }

  paginate(event) {
    
      this.offset = parseInt(event.first);
      this.limit = parseInt(event.rows);
    
    
      
      if (this.limit > this.count)
      this.limit = Number(this.count);
      this.loader = true;
      this.getProgressBar();
      if ((this.limit + this.offset) > this.count)
      this.limit = Number(this.count) - Number(this.offset);
      this.makeajaxcall();
  }

  /** Method for progressbar */
getProgressBar() {
  this.value =1;
  let interval = setInterval(() => {
    this.value = this.value + Math.floor(Math.random() * 10) + 1;
    if (this.value >= 100) {
      this.value = 100;
      clearInterval(interval);
    }
  }, 300);
}
  /*Function is called when Instance report is opened (from tried and success)*/
  urlInstanceReport(row,status?) {
    this.commonService.nsURLInstance={}; // for in case if user apply filter in instance then go back in summary then goes to instance. 
    // then the object will still be remaining there therefore will oopen up same data of instance again. for bug :68564
    this.commonService.currentReport = 'URL Instance' ;
    console.log("inside url instance ==>",this.commonService.nsURLSummary , " instacne ",this.commonService.nsURLInstance," nsCQM ** ",this.ddrData.nsCQMFilter["URL Instance"]);
    this.ddrData.nsCQMFilter["URL Instance"]=undefined;
    this.nsCommonData.urlInstanceData = row;
    this.nsCommonData.urlidx = row.urlindex;
    this.nsCommonData.FailureStatus = undefined;
    this.nsCommonData.urlsessionsummarydata = undefined;
    this.ddrData.summaryToInstanceFlag='true';
    if(status){
      this.nsCommonData.urlInstancethroughsuccess = true;
    }
    else{
      this.nsCommonData.urlInstancethroughsuccess = false;
    }
    if(this.commonService.isCQM)
    {
      console.log("inside of cqm cond==>",this.commonService.nsURLSummary);
      this.commonService.nsURLInstance=JSON.parse(JSON.stringify(this.commonService.nsURLSummary));
      this.commonService.nsURLInstance['reportType']='instance';
      delete this.commonService.nsURLInstance['fields'];
      this.commonService.nsURLInstance['urlidx']=this.nsCommonData.urlidx;
      if (this.nsCommonData.urlInstancethroughsuccess)
      this.commonService.nsURLInstance['statusCode']=0;
      if(this.commonService.nsURLInstance['strGroupBy'] && this.commonService.nsURLInstance['order'])
      this.commonService.nsURLInstance=this.commonService.filterGroupOrder(this.commonService.nsURLInstance);
      else
      delete this.commonService.nsURLInstance['strGroupBy']; 
      if (this.urlSummaryStatus) {
        this.commonService.nsURLInstance['nsErrorName'] = row.errorname;
      }
      if(row['status']!=undefined && row['status']!="-" && row['status']!="NA") //works in case of group by status
      {
        this.commonService.nsURLInstance['statusCode']=row['status'];
      }
      console.log("this.commonService.nsURLInstance==> going ourt of summary=====>",this.commonService.nsURLInstance);
      // if (this.nsCommonData.urlsessionsummarydata != undefined) {
      //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
      // }

    this.commonService.isFromUrlSummary=true;
    }
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'URL Instance');
    this.ddrData.nsFromGraph = false;
    if (this.urlSummaryStatus) {
      this.ddrData.errorNameUrl = row.errorname;
      this.ddrData.fromReport = true;
      this.ddrData.errorUserSession = row.errorname;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY_STATUS;
      this._router.navigate(['/home/ddr/nsreports/urlInstance']);
    } else {
      this.ddrData.errorUserSession = undefined;
      this.ddrData.errorNameUrl = undefined;
      this.ddrData.fromReport = false;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY;
      this._router.navigate(['/home/ddr/nsreports/urlInstance']);
    }
  }

  /*Function is called when url component detail report is opened (from average)*/
  componentDetails(row) {
    this.nsCommonData.urlsessionsummarydata = undefined;
    this.nsCommonData.urldetaildata = row;
    this.nsCommonData.urlidx = row.urlindex;
    this.nsCommonData.pgDetailToURLDetailFlag = false;
    if (this.urlSummaryStatus) {
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY_STATUS;
      this._router.navigate(['/home/ddr/nsreports/urldetails']);
    } else {
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY;
      this._router.navigate(['/home/ddr/nsreports/urldetails']);
    }
  }

  failure(row) {
    this.nsCommonData.urlsessionsummarydata = undefined;
    this.nsCommonData.urlfaildata = row;
    this.nsCommonData.urlidx = row.urlindex;
    this.nsCommonData.urlInstancethroughsuccess = false;
    if (this.urlSummaryStatus) {
      this.ddrData.errorUserSession = row.errorname;
      this.ddrData.errorNameUrl = row.errorname;
      this.ddrData.fromReport = true;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY_STATUS;
      this.nsCommonData.FailureStatus = row.status;
     // this._router.navigate(['/home/ddr/nsreports/urlInstance'])
    } else {
      this.ddrData.errorUserSession = undefined;
      this.ddrData.errorNameUrl = undefined;
      this.ddrData.fromReport = false;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY;
     // this._router.navigate(['/home/ddr/nsreports/urlfail']);
    }
    if(this.commonService.isCQM)
    { 
      if(this.urlSummaryStatus)
      {

        console.log("inside of cqm cond==>",this.commonService.nsURLSummary);
        this.commonService.nsURLInstance=JSON.parse(JSON.stringify(this.commonService.nsURLSummary));
        this.commonService.nsURLInstance['reportType']='instance';
        delete this.commonService.nsURLInstance['fields'];
        this.commonService.nsURLInstance['urlidx']=this.nsCommonData.urlidx;
        if (this.nsCommonData.urlInstancethroughsuccess)
        this.commonService.nsURLInstance['statusCode']=0;
        delete this.commonService.nsURLInstance['strGroupBy'];
        if (this.urlSummaryStatus) {
          this.commonService.nsURLInstance['nsErrorName'] = row.errorname;
        }
        if(row['status']!="-")
        {
          this.commonService.nsURLInstance['statusCode']=row['status'];
        }      
        
        console.log("this.commonService.nsURLInstance==> going ourt of summary=====>",this.commonService.nsURLInstance);
        // if (this.nsCommonData.urlsessionsummarydata != undefined) {
        //   ajaxParam += '&pageName=' + this.nsCommonData.urlsessionsummarydata.pageName + '&scriptName=' + this.nsCommonData.urlsessionsummarydata.scriptName;
        // }
  
      this.commonService.isFromUrlSummary=true;

      }
      else {
        this.commonService.nsURLFailure = JSON.parse(JSON.stringify(this.commonService.nsURLSummary));
        console.log("this.commonService.nsURLFailure==>", this.commonService.nsURLFailure);

        this.commonService.nsURLFailure['objid'] = this.nsCommonData.urlidx;  //for case when u click on diff row when coming back from breadcrumb.
        console.log("2nd cond==>", this.nsCommonData.urlidx);
      
      delete this.commonService.nsURLFailure['urlidx'];
      delete this.commonService.nsURLFailure['transidx'];
      delete this.commonService.nsURLFailure['pageidx'];
      delete this.commonService.nsURLFailure['scriptidx'];
      delete this.commonService.nsURLFailure['fields'];
      delete this.commonService.nsURLFailure['location'];
      delete this.commonService.nsURLFailure['access'];
      delete this.commonService.nsURLFailure['browser'];
      delete this.commonService.nsURLFailure['strGroupBy'];
      delete this.commonService.nsURLFailure['order'];
          
      this.commonService.nsURLFailure['reportType']='failure';
      
      if(this.commonService.nsURLFailure['statusCode']==-2 ||this.commonService.nsURLFailure['statusCode']==0)
      {
        this.commonService.nsURLFailure['statusCode']=-1;
      }
      if(row['status']!="-")
      {
        this.commonService.nsURLFailure['statusCode']=row['status'];
      }      

      this.commonService.nsURLFailure['strStatusName']='NA';
      delete this.commonService.nsURLInstance['fields'];
      console.log("this.commonservice.nsURLFailure===> going out==>",this.commonService.nsURLFailure);
      // this.url += '&object=0&limit=22&offset=0&statusCode=-1&showCount=false' + '&startTime=' + startTime + '&endTime=' 
      // endTime + '&reportType=failure' + '&strStatusName=NA' + '&objid=' + this.urlidx;
     this.commonService.isFromUrlSummary=true;
    }
  }
    if (this.urlSummaryStatus) {
      this.ddrData.nsFromGraph = false;
      this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'URL Instance');
      this._router.navigate(['/home/ddr/nsreports/urlInstance']);
    }
    else {
      this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'URL Failure');
      this._router.navigate(['/home/ddr/nsreports/urlfail']);
    }
}

  createTable() {
    this.cols = [] ;
    let urlSummaryParam = this.commonService.nsURLSummary;
    this.cols = [
      { field: 'urlName', header: 'URL Name', sortable: true, align: 'left', action: true },
      { field: 'tried', header: 'Tried', sortable: 'custom', align: 'right', action: true },
      { field: 'success', header: 'Success', sortable: 'custom', align: 'right', action: true },
      { field: 'fail', header: 'Fail', sortable: true, align: 'right', action: true },
      { field: 'avgmin', header: 'Min', sortable: 'custom', align: 'right', action: true },
      { field: 'avgaverage', header: 'Average', sortable: 'custom', align: 'right', action: true },
      { field: 'avgmax', header: 'Max', sortable: 'custom', align: 'right', action: true },
      { field: 'avgmedian', header: 'Median', sortable: 'custom', align: 'right', action: true },
      { field: 'avgeighty', header: '80%tile', sortable: 'custom', align: 'right', action: true },
      { field: 'avgninety', header: '90%tile', sortable: 'custom', align: 'right', action: true },
      { field: 'avgninetyFive', header: '95%tile', sortable: 'custom', align: 'right', action: true },
      { field: 'avgninetyNine', header: '99%tile', sortable: 'custom', align: 'right', action: true }
    ];

    this.visibleCols = [
      'urlName', 'tried', 'success', 'fail', 'avgmin', 'avgaverage',
      'avgmax', 'avgmedian', 'avgeighty', 'avgninety', 'avgninetyFive',
      'avgninetyNine'
    ];
    this.renameArray = { "urlName": "URL Name", "tried": "Tried", "success": "Success", "fail": "Fail", "avgmin": "Min", "avgaverage": "Average", "avgmax": "Max", "avgmedian": "Median", "avgeighty": "80%tile", "avgninety": "90%tile", "avgninetyFive": "95%tile", "avgninetyNine": "99%tile"}
    this.colOrder = ['URL Name', 'Tried', 'Success', 'Fail', 'Min', 'Average', 'Max', 'Median', '80%tile', '90%tile', '95%tile', '99%tile'];
  
    if (this.commonService.nsURLSummary['strGroupBy'] && this.commonService.nsURLSummary['strGroupBy'].indexOf('status') != -1) {
      this.cols.push({ field: 'errorname', header: 'Status', sortable: true, action: true, width: '30' })
      this.visibleCols.push("errorname");

      this.renameArray['errorname'] = 'Status';
      this.colOrder.push('Status');
  }
  else {
      this.cols.push({ field: 'failPercent', header: '%Fail', sortable: 'custom', action: true, width: '20' })
      this.visibleCols.push('failPercent');
      this.renameArray['failPercent'] = '%Fail';
      this.colOrder.push('%Fail');
  }
  
  if (this.commonService.nsURLSummary['strGroupBy'] && this.commonService.nsURLSummary['strGroupBy'].indexOf('transaction') != -1) {
      this.cols.push({ field: 'transactionName', header: 'Transaction Name', sortable: 'custom', action: true, align: 'right', width: '50'});
      this.visibleCols.push("transactionName");
      this.renameArray['transactionName']='Transaction Name';
      this.colOrder.push('Transaction Name');
    }
    if (this.commonService.nsURLSummary['strGroupBy'] && this.commonService.nsURLSummary['strGroupBy'].indexOf('page') != -1) {
      this.cols.push({ field: 'pageName', header: 'Page Name', sortable: 'custom', action: true, align: 'right', width: '50'});
      this.visibleCols.push("pageName");
      this.renameArray['pageName']='Page Name';
      this.colOrder.push('Page Name');
    }
  if(this.commonService.nsURLSummary['strGroupBy'] && (this.commonService.nsURLSummary['strGroupBy'].indexOf('session') != -1 || this.commonService.nsURLSummary['strGroupBy'].indexOf('generator') != -1) )
  {
    if (this.commonService.nsURLSummary['strGroupBy'] && this.commonService.nsURLSummary['strGroupBy'].indexOf('session') != -1) {
      this.cols.push({ field: 'scriptName', header: 'Script Name', sortable: 'custom', action: true, width: '30' })
      this.visibleCols.push('scriptName');
      this.renameArray['scriptName'] = 'Script Name';
      this.colOrder.push('Script Name');
    }
    if (this.commonService.nsURLSummary['strGroupBy'] && this.commonService.nsURLSummary['strGroupBy'].indexOf('generator') != -1) {
      this.cols.push({ field: 'generatorName', header: 'Generator Name', sortable: 'custom', action: true, width: '30' })
      this.visibleCols.push('generatorName');
      this.renameArray['generatorName'] = 'Generator Name';
      this.colOrder.push('Generator Name');
  }
  }
    else
    {
      this.cols.push({ field: 'sessionCount', header: 'Script Count', sortable: 'custom', action: true, align: 'right',width: '50'})
      this.visibleCols.push('sessionCount');
      this.renameArray['sessionCount']='Script Count';
      this.colOrder.push('Script Count');
   
    }
      console.log("final cols",this.cols,"visible cols===>",this.visibleCols);


    /*Component changes in case of url summary by status(fail% column is not shown and status column is added)*/
  


    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    console.log('column options', this.columnOptions);
  }

  /*
  **FUnction used to custom sort for intger and float
  */
  sortColumnsOnCustom(event, urlSummaryData) {
    //console.log(event)
    let fieldValue = event["field"];

    if (fieldValue == "avgmin")
      fieldValue = ["min"];
    if (fieldValue == "avgaverage")
      fieldValue = ["average"];
    if (fieldValue == "avgmax")
      fieldValue = ["max"];
    if (fieldValue == "avgmedian")
      fieldValue = ["median"];
    if (fieldValue == "avgeighty")
      fieldValue = ["eighty"];
    if (fieldValue == "avgninety")
      fieldValue = ["ninety"];
    if (fieldValue == "avgninetyFive")
      fieldValue = ["ninetyFive"];
    if (fieldValue == "avgninetyNine")
      fieldValue = ["ninetyNine"];


    if (event.order == -1) {
      event.order = 1
      urlSummaryData = urlSummaryData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        console.log("value", value, "value2", value2);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      event.order = -1;
      //asecding order
      urlSummaryData = urlSummaryData.sort(function (a, b) {
        var value = parseInt(a[fieldValue]);
        var value2 = parseInt(b[fieldValue]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }

    this.urlSummaryData = [];
    //console.log(JSON.stringify(tempData));
    if (urlSummaryData) {
      urlSummaryData.map((rowdata) => { this.urlSummaryData = this.Immutablepush(this.urlSummaryData, rowdata) });
    }

  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  openSessionName(nodeData) {
    let url = this.getHostUrl() + '/' + this.commonParams.product +
      '/recorder/recorder.jsp?openFrom=TR' + this.commonParams.testRun +
      '&scriptName=' + nodeData;
    console.log('JNLP Launcher url ', url);

    window.open(url, "_blank");
  }

  scriptCount(row) {
    this.ddrData.nsCQMFilter["URL Session Summary"]=undefined; //resetting if user clicks on the row of urs summary.

    this.nsCommonData.urlsessionsummarydata = undefined;
    this.nsCommonData.urlreportid = this.urlSummaryStatus;
    this.nsCommonData.urlidx = row.urlindex;
    this.nsCommonData.urlSummaryData = row;
    if(this.commonService.isCQM)
    {
     console.log("in cqm cond of session summary==>",this.commonService.nsURLSummary);
     this.commonService.nsURLSession=JSON.parse(JSON.stringify(this.commonService.nsURLSummary));
     this.commonService.nsURLSession['fields']=4095;
     this.commonService.nsURLSession['summary']='summary';
     if(this.nsCommonData.urlreportid)
     this.commonService.nsURLSession['group'] = "page,session,status"
     else
     this.commonService.nsURLSession['group'] = "page,session";
    // if(this.commonService.nsURLSession['urlidx'] && (this.commonService.nsURLSession['urlidx']=='undefined' || this.commonService.nsURLSession['urlidx']))
    // {
    //  this.commonService.nsURLSession['urlidx']=this.nsCommonData.urlidx;
    // }
     this.commonService.nsURLSession['urlidx']=this.nsCommonData.urlidx;
     this.commonService.nsURLSession['strStatusName']='NA';
     this.commonService.nsURLSession['strGroupBy']='';
     this.commonService.isFromUrlSummary=true;
  
     if(row['status']!="-")
     {
       this.commonService.nsURLSession['statusCode']=row['status'];
     }
       
  }
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'URL Session Summary');
    if (this.urlSummaryStatus) {
      this.commonService.nsURLSession['statusCode'] = row['status'];
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY_STATUS;
    } else {
      this.commonService.nsURLSession['statusCode'] = '-2';
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.URL_SUMMARY;
    }
    this._router.navigate(['/home/ddr/nsreports/urlsessionsummary']);
  }

  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    if (this.visibleCols.length !== 0) {
      console.log("inside showhide");
      for (let i = 0; i < this.cols.length; i++) {
        for (let j = 0; j < this.visibleCols.length; j++) {
          if (this.cols[i].field === this.visibleCols[j]) {
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });
  let n=this.visibleCols.length;
  this.width=1240/n;
  }

   /*This Method is used for handle the Column Filter Flag*/
   toggleColumnFilter() {
    if (this.isEnabledColumnFilter) {
      this.isEnabledColumnFilter = false;
    } else {
      this.isEnabledColumnFilter = true;
    }
    this.changeColumnFilter();
  }


 /*This method is used to Enable/Disabled Column Filter*/
 changeColumnFilter() {
  try {
    let tableColumns = this.cols;
    if (this.isEnabledColumnFilter) {
      this.toggleFilterTitle = 'Show Filters';
      for (let i = 0; i < tableColumns.length; i++) {
        tableColumns[i].filter = false;
      }
    } else {
      this.toggleFilterTitle = 'Hide Filters';
      for (let i = 0; i < tableColumns.length; i++) {
        tableColumns[i].filter = true;
      }
    }
  } catch (error) {
    console.log('Error while Enable/Disabled column filters', error);
  }
}

  /* Download report for URL SUmmary report  */
  downloadReports(reports: string) {
    this.urlSummaryDownloadData = JSON.parse(JSON.stringify(this.urlSummaryData));
    // if (this.urlSummaryStatus)
    //   colOrder.splice(5,0,"Status");
    // else
    //   colOrder.splice(5,0,"Fail%");


    this.urlSummaryDownloadData.forEach((val, index) => {
      delete val['urlindex'];
      delete val['pageCount'];
      delete val['min'];
      delete val['average'];
      delete val['max'];
      delete val['median'];
      delete val['eighty'];
      delete val['ninety'];
      delete val['ninetyFive'];
      delete val['ninetyNine'];
      
      
      delete val['status'];

      if(this.colOrder.indexOf('Status')==-1)
      delete val['statusName'];

      if(this.colOrder.indexOf('%Fail')==-1)
      delete val['failPercent'];

      if(this.colOrder.indexOf('Generator Name')==-1)
      delete val['generatorName'];
      else
      delete val['sessionCount'];

      if(this.colOrder.indexOf('Transaction Name')==-1)
      delete val['transactionName'];

      if(this.colOrder.indexOf('Page Name')==-1)
      delete val['pageName'];

      if(this.colOrder.indexOf('Script Name')==-1)
      delete val['scriptName'];
      else
      delete val['sessionCount'];
  
    });
  //  console.log("rename array==>", this.renameArray, "this.cols====>", this.colOrder ," this.urlSummaryDownloadData===>",this.urlSummaryDownloadData);    

    let downloadObj: Object = {
      downloadType: reports,
      varFilterCriteria: this.filter,
      strSrcFileName: 'URLSummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(this.renameArray),
      colOrder: this.colOrder.toString(),
      jsonData: JSON.stringify(this.urlSummaryDownloadData)
    };
    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.commonParams.product) +
      '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res =>
        (this.openDownloadReports(res)));
    else
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
        (this.openDownloadReports(res)));
  }

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open(decodeURIComponent(this.getHostUrl(true)) + '/common/' + res);
  }

  formatter(value) {
    if (value != '' && !isNaN(value)) {
      return Number(Number(value)).toLocaleString();
    }
    else if(value === ''){
    return '-';
    }
    else
      return value;
  }
  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
   this.subscribeURL.unsubscribe();
   this.commonService.isCQM=false;
  }
  showMessage(mssg: any) {
    this.msgs = [];
    if(mssg=="Query Saved")
    this.msgs.push({ severity: 'success', summary: 'Success Message', detail: mssg });
    else if(mssg=="Query Already Defined")
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
    else
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: mssg });
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
