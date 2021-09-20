import { Component, OnInit ,Input} from '@angular/core';
import { CommonServices } from '../../../../services/common.services';
import 'rxjs/Rx';
import { CavConfigService } from '../../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../../main/services/cav-top-panel-navigation.service';
import { SelectItem } from '../../../../interfaces/selectitem';
import { Router } from '@angular/router';
import { DdrBreadcrumbService } from './../../../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../../../constants/breadcrumb.constants';
import { NsCommonService } from '../../services/ns-common-service';
import { ActivatedRoute } from '@angular/router';
import { DdrDataModelService } from "../../../../../../main/services/ddr-data-model.service";
import { DDRRequestService } from '../../../../services/ddr-request.service';

@Component({
  selector: 'app-page-session-summary',
  templateUrl: './page-session-summary.component.html',
  styleUrls: ['./page-session-summary.component.css']
})
export class PageSessionSummaryComponent implements OnInit {

  pageSessionSummaryData : Array<PageSessionSummaryInterface>;
  urlParam:any;
  limit:number = 50;
  offset:number = 0;
  cols:any[];
  visibleCols: any[];
  columnOptions: SelectItem[];
  url:string;
  totalCount:any;
  prevColumn:any;
  screenHeight:any;
  filterCriteria:string="";
  status:string='';
  loading = false;
  strTitle:any;
  showDownloadOption:boolean=true;
  pageSummaryByStatus:boolean;
  dynamicWidthColumn : number ;  //  To calculate dynamic width of column
  isCancelQuery: boolean = false;
  isCancelQuerydata: boolean = false;
  queryId:any;
  loader: boolean;
  value: number;

  constructor(public commonService: CommonServices, private _navService: CavTopPanelNavigationService,
    private _cavConfigService: CavConfigService , private _router: Router,private nsCommonData:NsCommonService,
    private breadcrumbService: DdrBreadcrumbService, private route :ActivatedRoute,private _ddrData: DdrDataModelService,
    private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.commonService.isToLoadSideBar=false;
    console.log("pgSummaryToSessionSummaryFlag = " , this.nsCommonData.pgSummaryToSessionSummaryFlag , " , pgSummaryToSessionSummaryData = " , this.nsCommonData.pgSummaryToSessionSummaryData);
    this.loading = true;
    this.randomNumber();
    this.pageSummaryByStatus =  this.nsCommonData.isFromSummaryByStatus;
    console.log( " pageSummaryByStatus ** " , this.pageSummaryByStatus);
    this.screenHeight = Number(this.commonService.screenHeight)-100;
    this.urlParam = this.commonService.getData();
    console.log(" **** url Param **** " , this.urlParam);
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.PAGE_SESSION_SUMMARY);
    this.commonService.currentReport="Page Session Summary";
    this.commonService.checkForNsKeyObj(this._ddrData.nsCQMFilter,this.commonService.currentReport);
    console.log("this.commonservice.nsPageSessionSummary==>",this.commonService.nsPageSessionSummary); 
  
    this.getPageSessionSummaryData();
    this.getPageSessionSummaryDataCount();
    this.makeColumns();
    this.setTestRunHeader();
  }

  /*Method is used get host url*/
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl();
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      this.urlParam.testRun = this._ddrData.testRun;
      console.log("all case url==>", hostDcName, "all case test run==>", this.urlParam.testRun);
    }
    console.log('hostDcName getHostURL =', hostDcName);
    return hostDcName;
  }

  makeColumns()
  {
    this.cols = [{ field: 'pageName', header: 'Page Name', sortable: true, action: true, align: 'left', width: '70' },
    { field: 'scriptName', header: 'Script Name', sortable: true, action: true, align: 'right',width: '50'},
    { field: 'tried', header: 'Tried', sortable: 'custom', action: true, align: 'right', width: '50'},
    { field: 'success', header: 'Success', sortable: 'custom', action: true, align: 'right', width: '50'}];

    if(this.pageSummaryByStatus == true)
      this.cols = this.cols.concat({ field: 'status', header: 'Status', sortable: true, action: true, align: 'right', width: '70'});
    else
      this.cols = this.cols.concat( { field: 'failPercent', header: 'Fail%', sortable: 'custom', action: true, align: 'right', width: '50'});

    this.cols = this.cols.concat({ field: 'fail', header: 'Fail', sortable: 'custom', action: true, align: 'right', width: '50'},
    { field: 'min', header: 'Min', sortable: 'custom',action: true, align: 'right', width: '70'},
    { field: 'max', header: 'Max', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'avg', header: 'Average', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'median', header: 'Median', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'percent80', header: '80%tile', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'percent90', header: '90%tile', sortable: 'custom', action: true, align: 'right',width: '70'},
    { field: 'percent95', header: '95%tile', sortable: 'custom', action: true, align: 'right', width: '70'},
    { field: 'percent99', header: '99%tile', sortable: 'custom', action: true, align: 'right', width: '70'});   

    console.log("this.cols final = " , this.cols);

    this.visibleCols = [
      'pageName','scriptName','tried','success','fail','failPercent','min','max','avg','median','percent80','percent90','percent95','percent99'
    ];

    this.columnOptions = [];
    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i].field });
    }
    console.log('column options', this.columnOptions);
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
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
    let n = this.visibleCols.length ;
    this.dynamicWidthColumn = Number(1300/n) ;
    this.dynamicWidthColumn = Number(this.dynamicWidthColumn.toFixed(0)  ) - 2 ;
  }

  customSortOnColumns(event, tempData) {
    if (event.order == -1) {
                   var temp = (event["field"]);
                   event.order = 1; //desending order
                   console.log('temp datattaaa ', temp);
                   tempData = tempData.sort(function (a, b) {
                       var value = Number(a[temp].replace(/[:.,]/g, ''));
                       var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                       
                       return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
                   });
               }
               else {
                   var temp = (event["field"]);
                   event.order = -1; //asecding order
                   tempData = tempData.sort(function (a, b) {
                       var value = Number(a[temp].replace(/[:.,]/g, ''));
                       var value2 = Number(b[temp].replace(/[:.,]/g, ''));
                       
                       return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
                   });
               }
         this.pageSessionSummaryData = [];
           //console.log(JSON.stringify(tempData));
           if (tempData) {
               tempData.map((rowdata) => { this.pageSessionSummaryData = this.Immutablepush(this.pageSessionSummaryData, rowdata) });
           }
   
       }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  getPageSessionSummaryData()
  {
    console.log(" ***** get Data from Query ***** "); 
    let ajaxParam='';
    if(this.pageSummaryByStatus == true)
      this.status = this.nsCommonData.pgSummaryToSessionSummaryData['statusCode'];
    else
      this.status = '-2';

      if(this.commonService.enableQueryCaching == 1){
        this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageSummary?cacheId='+ this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
      }
      else{
        this.url =  this.getHostUrl() + '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/pageSummary?testRun=' + this.urlParam.testRun;
      }

    
    ajaxParam  = '&startTime=' + this.urlParam.startTime + '&endTime=' + this.urlParam.endTime + '&object=1&field=4095&summaryToSessionSummaryFlag=' 
    + this.nsCommonData.pgSummaryToSessionSummaryFlag +'&pageName=' + this.nsCommonData.pgSummaryToSessionSummaryData['pageName'] + '&status='
    + this.status + '&pageIndex=' + this.nsCommonData.pgSummaryToSessionSummaryData['pageIndex'] + '&summaryByStatusFlag=' 
    + this.pageSummaryByStatus;

    if (this.nsCommonData.pgSummaryToSessionSummaryFlag && this.pageSummaryByStatus==false)
      ajaxParam += "&group=session";
    else if (this.nsCommonData.pgSummaryToSessionSummaryFlag && this.pageSummaryByStatus)
      ajaxParam += "&group=status,session";
    
    if(this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    ajaxParam += '&groupName=' +this._ddrData.vectorName;
  if(this._ddrData.generatorName || (this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1))
    ajaxParam += '&generatorName=' +this._ddrData.generatorName;

    if (this.commonService.isFromPageSummary) {

      if (this.nsCommonData.pgSummaryToSessionSummaryFlag && this.pageSummaryByStatus == false)
        this.commonService.nsPageSessionSummary['group'] = 'session';
      else if (this.nsCommonData.pgSummaryToSessionSummaryFlag && this.pageSummaryByStatus)
        this.commonService.nsPageSessionSummary['group'] = 'status,session';

      ajaxParam = this.commonService.makeParamStringFromObj(this.commonService.nsPageSessionSummary, true) +
        '&summaryToSessionSummaryFlag=' + this.nsCommonData.pgSummaryToSessionSummaryFlag + '&summaryByStatusFlag=' + this.pageSummaryByStatus;

      //setting value to key
      this._ddrData.nsCQMFilter[this.commonService.currentReport] = this.commonService.nsPageSessionSummary;
      console.log("this._ddrData.nsCQMFilter in data call==>", this._ddrData.nsCQMFilter);

    }
    else if (this._ddrData.nsCQMFilter[this.commonService.currentReport]) {
      this.commonService.isFromPageSummary=true;
      console.log("inside else cond===> ", this._ddrData.nsCQMFilter[this.commonService.currentReport])
      ajaxParam = this.commonService.makeParamStringFromObj(this._ddrData.nsCQMFilter[this.commonService.currentReport], true) +
      '&summaryToSessionSummaryFlag='+ this.nsCommonData.pgSummaryToSessionSummaryFlag +'&summaryByStatusFlag=' + this.pageSummaryByStatus;
    }

    // if ( this.pageSummaryByStatus && this.nsCommonData.pgSummaryToSessionSummaryFlag)
    //   ajaxParam += "&group=status";
    
    

    this.url+=ajaxParam;
    let finalUrl = this.url + '&limit=' + this.limit + '&offset=' + this.offset + '&showCount=false' + '&queryId='+this.queryId;
    console.log("final url *** " , finalUrl);
    setTimeout(() => {
      this.openpopup();
     }, this._ddrData.guiCancelationTimeOut);
    return this.ddrRequest.getDataUsingGet(finalUrl).subscribe(data => this.assignPageSessionSummaryData(data));
  }

  assignPageSessionSummaryData(res : any)
  {
    console.log("response for page summary = " , res);
    this.isCancelQuerydata = true;
    this.loading = false;
    this.loader = false;
    this.pageSessionSummaryData = res.data;
    if(this.pageSessionSummaryData.length == 0)
      this.showDownloadOption = false;
    else
      this.showDownloadOption = true;
    this.showFilterCriteria(res.startTimeInDateFormat,res.endTimeInDateFormat);
  }
  
  getPageSessionSummaryDataCount()
  {
    this.url += "&showCount=true"; 
    console.log(" url in data count = " , this.url);
    return this.ddrRequest.getDataUsingGet(this.url).subscribe(data => this.assignPageSessionSummaryDataCount(data));
  }

  assignPageSessionSummaryDataCount(res : any)
  {
    console.log("res in data count = " , res);
    this.totalCount = res.count;
  }

  showFilterCriteria(startTimeInDateFormat:any,endTimeInDateFormat:any)
  {
    if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
      this.filterCriteria += "DC=" + this._ddrData.dcName;
    if(startTimeInDateFormat != "NA" && startTimeInDateFormat != "" && startTimeInDateFormat != undefined && startTimeInDateFormat != "undefined")
        this.filterCriteria += ", From=" + startTimeInDateFormat;
    if(endTimeInDateFormat != "NA" && endTimeInDateFormat != "" && endTimeInDateFormat != undefined && endTimeInDateFormat != "undefined")
        this.filterCriteria += ", To=" + endTimeInDateFormat;

    if(this._ddrData.generatorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("generator") != -1)
    this.filterCriteria += ', Generator Name=' +this._ddrData.generatorName;
    
    if(this._ddrData.vectorName && this._ddrData.vectorMetaData && this._ddrData.vectorMetaData.toLowerCase().indexOf("group") != -1)
    this.filterCriteria += ', Group Name=' +this._ddrData.vectorName;    
    
    if (this.filterCriteria.startsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(1);
      
    if (this.filterCriteria.endsWith(',')) 
      this.filterCriteria = this.filterCriteria.substring(0, this.filterCriteria.length - 1);
  }

  setTestRunHeader()
  {
    if (this.urlParam && this.urlParam.product.toLowerCase() == 'netstorm')
      this.strTitle = 'Netstorm - Page Session Summary Report - Test Run : ' + this.urlParam.testRun;
    else if(this.urlParam && this.urlParam.product.toLowerCase() == 'netcloud')
      this.strTitle = 'NetCloud - Page Session Summary Report - Test Run : ' + this.urlParam.testRun;
    else 
      this.strTitle = 'Netdiagnostics Enterprise - Page Session Summary Report - Session : ' + this.urlParam.testRun;
  }

  openSessionName(nodeData)
  {
      let url= this.getHostUrl() + '/' + this.urlParam.product +
      '/recorder/recorder.jsp?openFrom=TR'+this.urlParam.testRun +
      '&scriptName='+nodeData + "&sesLoginName=" + sessionStorage.getItem('sesLoginName') ;
      console.log('JNLP Launcher url ',url);

      window.open(url, "_blank");
  }

  openPageFailureReport(nodeRow : any)
  {
    console.log("node row for page failure report = " , nodeRow);
    this._ddrData.nsCQMFilter["Page Failure"]=undefined;
    this.nsCommonData.pgSummaryToFailureData = nodeRow;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SESSION_SUMMARY;
   if(this.commonService.isFromPageSummary)
   {
     this.commonService.nsPageFailure=JSON.parse(JSON.stringify(this.commonService.nsPageSessionSummary))
     this.commonService.nsPageFailure['reportType'] = 'failure';
     if (this.commonService.nsPageFailure['status'] == -2 || this.commonService.nsPageFailure['status'] == -0) {
       this.commonService.nsPageFailure['status'] = -1;
     }

     this.commonService.nsPageFailure['pageName']     =this.nsCommonData.pgSummaryToFailureData['pageName'];
      this.commonService.nsPageFailure['objectId'] = this.nsCommonData.pgSummaryToFailureData['pageIndex'] ;
     if(!this.commonService.nsPageFailure['scriptName'])
     this.commonService.nsPageFailure['scriptName']=this.nsCommonData.pgSummaryToFailureData['scriptName'];
      
   // this.scriptName = this.nsCommonData.pgSummaryToFailureData['scriptName'];

      delete this.commonService.nsPageFailure['transidx'];
      if (this.commonService.nsPageFailure['script']) {
        this.commonService.nsPageFailure['scriptName'] = this.commonService.nsPageFailure['script'];
        delete this.commonService.nsPageFailure['script'];

      }
      if (this.commonService.nsPageFailure['transactionName']) {
        this.commonService.nsPageFailure['trans'] = this.commonService.nsPageFailure['transactionName'];
        delete this.commonService.nsPageFailure['transactionName'];

      }
     delete this.commonService.nsPageFailure['location'];
     delete this.commonService.nsPageFailure['access'];
     delete this.commonService.nsPageFailure['browser'];
     delete this.commonService.nsPageFailure['fields'];
     delete this.commonService.nsPageFailure['transidx'];
     delete this.commonService.nsPageFailure['group'];
     delete this.commonService.nsPageFailure['order'];

     console.log("going out of session to failure page==>",this.commonService.nsPageFailure);
    this.commonService.isFromPageSessionSummary=true;
  }
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Page Failure');
    this._router.navigate(['/home/ddr/nsreports/PageFailure']);
  }

  openPageComponentDetailReport(row:any)
  {
    if(this.commonService.isFromPageSummary)
    {
      this.commonService.nsPageDetails=JSON.parse(JSON.stringify(this.commonService.nsPageSessionSummary));
      this.commonService.isFromPageSessionSummary=true;
    }
    console.log("row = " , row);
    this.nsCommonData.currRowData = row;
    this.nsCommonData.objectType= '1';
    this.nsCommonData.isFromSessionCompDetail = false;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SESSION_SUMMARY;
    this._router.navigate(['/home/ddr/nsreports/PageComponentDetail'],{queryParams:{pageSummaryByStatus:this.pageSummaryByStatus}});
  }

  openPageInstanceReport(nodeData:any,status?:any)
  {
    console.log("nodeData for instance report = " , nodeData);
    this._ddrData.nsCQMFilter["Page Instance"]=undefined;
    let statusValue = '';
    if(this.pageSummaryByStatus == true)
      statusValue = nodeData.statusCode;
    else
    {
     // statusValue = status;
     this.nsCommonData.statuscode=status;
    }
    console.log("statusValue = " , statusValue);
    this.nsCommonData.pgSummaryToInstanceData = nodeData;
    //this.nsCommonData.pgSummaryToInstanceFlag = true;
    this._ddrData.pgSummaryToInstanceFlag = true;
    this._ddrData.pageFailure = false;
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_SESSION_SUMMARY;
  
    if(this.commonService.isFromPageSummary)
    {
      this.commonService.nsPageInstance=JSON.parse(JSON.stringify(this.commonService.nsPageSessionSummary));
      if(this.commonService.nsPageInstance['group'] && this.commonService.nsPageInstance['order'])
      this.commonService.nsPageInstance=this.commonService.filterGroupOrder(this.commonService.nsPageInstance);
      else
      delete this.commonService.nsPageInstance['group'];
      if (this._ddrData.pgSummaryToInstanceFlag == true) {
        this.commonService.nsPageInstance['pageName'] = this.nsCommonData.pgSummaryToInstanceData['pageName'];
        this.commonService.nsPageInstance['scriptName']= this.nsCommonData.pgSummaryToInstanceData['scriptName'];
        this.commonService.nsPageInstance['pageIndex']= this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
       //(status is 0 for Success only, positive for the Failure code, -1 for all failures -2 for All (Success and all failures))
        //if(!(this.commonService.nsPageInstance['status']==-1 || this.commonService.nsPageInstance['status'].every(x=>x>0)))

        if (this.commonService.nsPageInstance['pageIndex'] == -2) { //i.e no status filter was applied.
          if (status == '0' || status == '-2') {
            this.commonService.nsPageInstance['status'] = status;
            console.log("status got updated==>", this.commonService.nsPageInstance['status']);
          }
        }
        // ajaxParam += '&pageName=' + this.pageName + '&script=' + this.scriptName + "&pageIndex=" + this.nsCommonData.pgSummaryToInstanceData['pageIndex'];
      }
      this.commonService.isFromPageSessionSummary=true;
      console.log("going out of session to instance==>",this.commonService.nsPageInstance);
    }  
    this.commonService.nsAutoFillSideBar(this.commonService.currentReport,'Page Instance');
   //this._router.navigate(['/home/ddr/nsreports/PageInstance'],{queryParams:{ statusField : statusValue}});
   
   this._router.navigate(['/home/ddr/nsreports/PageInstance']);
  }

  paginate(event)
  {
    console.log("paginate event = " , event);
    this.offset = Number(event.first);
    this.limit = Number(event.rows);
    this.loader = true;
    this.getProgressBar();
    console.log("offset = " , this.offset , " , limit = " , this.limit);
    this.getPageSessionSummaryData();
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
  // Formatter for large values coming as comma seperated

  formatter(data: any) {
    if(Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }

  /**Formatter cell data for converting ms to sec field */

  msToTimeFormat(duration) 
  {
    if (!isNaN(duration))
    {
      var milliseconds , seconds , minutes , hours , temp, time;
      time = +duration;
      time = Math.round(time);
      milliseconds = time%1000;
      time = (time - milliseconds)/1000;
      hours = parseInt(Number(time/3600)+'');
      time = time%3600;
      minutes = parseInt(Number(time/60)+'');
      time = time%60;
      seconds = parseInt(Number(time)+'');
      return(this.appendStringToTime(hours,minutes,seconds,milliseconds));
    }
    else
      return duration;
  }

  appendStringToTime(hh,mm,ss,msec)
  {
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


  downloadReport(type:string)
  {
    let renameArr;
    let colOrder;

    renameArr = {
      'pageName':'Page Name','scriptName':'Script Name','tried':'Tried','success':'Success','fail':'Fail','failPercent':'Fail%','min':'Min',
      'max':'Max','avg':'Average','median':'Median','percent80':'80%tile','percent90':'90%tile','percent95':'95%tile','percent99':'99%tile'
    };
  
    colOrder = ['Page Name','Script Name','Tried','Success','Fail','Fail%','Min','Max','Median','Average','80%tile','90%tile','95%tile','99%tile'];  
   
    this.pageSessionSummaryData.forEach((val, index) => {
      delete val['pageIndex'];
      delete val['statusCode'];
      delete val['scriptCount'];
      val['min'] = this.msToTimeFormat(val['min']);
      val['max'] = this.msToTimeFormat(val['max']);
      val['avg'] = this.msToTimeFormat(val['avg']);
      val['median'] = this.msToTimeFormat(val['median']);
      val['percent80'] = this.msToTimeFormat(val['percent80']);
      val['percent90'] = this.msToTimeFormat(val['percent90']);
      val['percent95'] = this.msToTimeFormat(val['percent95']);
      val['percent99'] = this.msToTimeFormat(val['percent99']);
    });

    console.log("pageSummaryData for download **  " , this.pageSessionSummaryData);
    let downloadObj: Object = {
      downloadType: type,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'PageSummary',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArr),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(this.pageSessionSummaryData)
    };

    let downloadFileUrl = decodeURIComponent(this.getHostUrl(true)+'/'+ this.urlParam.product) + '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node")))
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, downloadObj).subscribe(res => (this.openDownloadReports(res)));
    else
      this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res => (this.openDownloadReports(res)));
  }
   

  openDownloadReports(res) {
    console.log('file name generate ===', res);
    window.open(decodeURIComponent(this.getHostUrl(true)) +'/common/' + res);
  }
  ngOnDestroy(): void {
 this.commonService.isFromPageSummary=false;
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
   url = decodeURIComponent(this.getHostUrl() + '/' + this.urlParam.product.replace("/",""))+"/v1/cavisson/netdiagnostics/webddr/cancleQuery?testRun="+ this.urlParam.testRun +"&queryId="+this.queryId;  
  console.log("Hello u got that",url);
    this.isCancelQuery = false;
     this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {return data});
  }

  openpopup(){
    if(!this.isCancelQuerydata)
    this.isCancelQuery =true;
  }

}

export interface PageSessionSummaryInterface {
  pageName : string;
  pageIndex : string;
  scriptName : string;
  tried : string;
  success : string;
  fail : string;
  failPercent : string;
  min : string;
  max : string;
  avg : string;
  median : string;
  percent80 : string;
  percent90 : string;
  percent95 : string;
  percent99 : string;
  status : string;
  statusCode : string;
}
