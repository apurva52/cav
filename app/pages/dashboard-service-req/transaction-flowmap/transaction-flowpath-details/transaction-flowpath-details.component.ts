import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TransactionFlowpathDetailsTable } from './service/transaction-flowpath-details.model';
import { TransactionFlowpathDetailsService } from './service/transaction-flowpath-details.service';
import { TransactionFlowpathDetailsLoadedState, TransactionFlowpathDetailsLoadingErrorState, TransactionFlowpathDetailsLoadingState } from './service/transaction-flowpath-details.state';
import { SessionService } from 'src/app/core/session/session.service';
import { TransactionFlowMapServiceInterceptor } from '../service/transaction-flowmap.service.interceptor';
import { TransactionFlowMapService } from '../service/transaction-flowmap.service';
import { Console } from 'console';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { DownloadReportLoadingState, DownloadReportLoadedState, DownloadReportLoadingErrorState} from './service/transaction-flowpath-details.state';

@Component({
  selector: 'app-transaction-flowpath-details',
  templateUrl: './transaction-flowpath-details.component.html',
  styleUrls: ['./transaction-flowpath-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class TransactionFlowpathDetailsComponent implements OnInit {
  data: TransactionFlowpathDetailsTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  isShow: boolean;
  _selectedColumns:TransactionFlowpathDetailsTable[];
  cols: any;

  // menuOptions: MenuItem[];
  downloadOptions: MenuItem[];
  items1 : MenuItem[];
  displayDetails: boolean;
  TrxDataFromBackEnd:any;
  showFlowpathDetailsModel:boolean;
  transactionTableArray:TransactionFlowpathDetailsTable[] = [];
  popupTitle = ""; //to show tittle of dialog box table on manu click of node
  popupFooter: any;
  popupFilter: any;
  reportID:any;
  Tabledata:any[]=[];
  showClipboard = false;
  isFromMain:boolean = false;
  dbCalloutDetails=[];
  backendTypeThree:boolean = false;
  backendTypeFive:boolean = false;
  backendTypeTwo:boolean = false;
  backendTypeTwentyTwo:boolean = false;
  backendTypeNine:boolean = false;
  backendTypeHTTP:boolean = false;
  backendTypeTwentyThree:boolean = false;
  backendTypeOne:boolean = false;
  backendTypeRemainingAll:boolean = false;
  // Need the tierName, serverName, instanceName in case when instanceType ='beckend'....
  tierName:any;
  serverName:any;
  instanceName:any;

  //For setting the boolean for nevigation of reports...
  isShowMCTTable:boolean = false;
  isShowMTTable:boolean = false;
  isShowHsTable:boolean = false;
  isShowDbTable:boolean = false;

  @Output() arrowClick = new EventEmitter<boolean>();

  constructor(
    private flowpathDetailsService: TransactionFlowpathDetailsService,
    private router: Router, private sessionService: SessionService,
    private transactionFlowMapService: TransactionFlowMapService,
    private interceptor: TransactionFlowMapServiceInterceptor
     )  // private transactionFlowMapServiceInterceptor: TransactionFlowMapServiceInterceptor
  {
    //this.interceptor = new TransactionFlowMapServiceInterceptor(transactionFlowMapService, this, sessionService);
  }

  ngOnInit(): void {
    const me = this;
    // me.TrxDataFromBackEnd = me.sessionService.getSetting("TrxFMBackEndData");
    //me.load();

    // me.menuOptions = [
    //   {
    //     label : 'View Method Call details'
    //   },
    //   {
    //     label : 'View Method Timing Report'
    //   },
    //   {
    //     label : 'View Hotspot Report'
    //   },
    //   {
    //     label : 'View DB Request Report'
    //   },
    //   {
    //     label : 'View Request/Response Body'
    //   },
    //   {
    //     label : 'View CallOut Body'
    //   },
    // ]
    me.downloadOptions = [
      {
        label : 'Word',
        command: () => {
          const me = this;
          me.downloadReportForAgg("worddoc");
        }
      },
      {
        label : 'Excel',
        command: () => {
          const me = this;
          me.downloadReportForAgg("excel");
        }
      },
      {
        label : 'PDF',
        command: () => {
          const me = this;
          me.downloadReportForAgg("pdf");
        }
      }
    ]
    me.items1 = [
      {
        label: 'Method Timing Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/method-timing']);
        },
      },
      {

        label: 'DB Request Reports',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/db-queries']);
        },
      },

      {
        label: 'Flowpath Analyzer',
        command: (event: any) => {
          this.router.navigate(['/flowpath-analyzer']);
        },
      },
      {
        label: 'BT IP Summary',
        command: (event: any) => {
          this.router.navigate(['/dashboard-service-req/ip-summary']);
        },
      },
    ];
    me.tierName = me.interceptor.jsonforflowmap[0].tierName;
    me.serverName = me.interceptor.jsonforflowmap[0].serverName;
    me.instanceName = me.interceptor.jsonforflowmap[0].appName;
  }

  showInstrumentationDetails(){
    this.displayDetails = true;
  }

  backDetails(){
    this.isShow = false;
    this.arrowClick.emit(this.isShow)
  }

  load() {
    const me = this;
    me.TrxDataFromBackEnd = me.sessionService.getSetting("TrxFMBackEndData");
    me.flowpathDetailsService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionFlowpathDetailsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TransactionFlowpathDetailsLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: TransactionFlowpathDetailsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: TransactionFlowpathDetailsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TransactionFlowpathDetailsLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: TransactionFlowpathDetailsLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    this.showDialogTable(me.data);
    // me.cols = me.data.headers[0].cols;
    // me.cols = [];
    //me._selectedColumns = me.cols;
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  openDownloadFileDialog() {
    const me = this;
    this.load();
    //me.showFlowpathDetailsModel = true;
  }
  close() {
    const me = this;
    me.showFlowpathDetailsModel = false;
    me.isShowMCTTable = false;
    me.isShowMTTable = false;
    me.isShowDbTable = false;
    me.isShowHsTable = false;
  }

  //to dispaly the table on manu click on nodes
  showDialogTable(obj) {
    const me = this;
    let objForTable = obj;
    me.transactionTableArray = [];
    me.popupTitle = "";
    me.popupFooter = '';
    let statusCodeIndex:number;
    me.cols = [];
    me._selectedColumns = [];
    let backENDType = me.flowpathDetailsService.getBackendType(obj.key, obj.backendType);
    this.showClipboard = false;
    if (backENDType == 3 || backENDType == 6)//3-coherence 5-memcache 6-cloudant
    {
      //this.col = this.createColumnArray('Call', 'Min', 'Max', 'Average', 'Count');
      for (const c of me.TrxDataFromBackEnd.headers1[0].cols)
        me.cols.push(c);
        statusCodeIndex = -1;
        me.popupTitle = "Coherence Call Stats";
        me._selectedColumns = me.cols;
        me.backendTypeThree = true;
        me.backendTypeFive = false;
        me.backendTypeTwo = false;
        me.backendTypeTwentyTwo = false;
        me.backendTypeNine = false;
        me.backendTypeTwentyThree= false;
        me.backendTypeHTTP = false;
        me.backendTypeOne = false;
        me.backendTypeRemainingAll= false;
    }

    else if (backENDType == 5) //5-memcache
    {
      //this.col = this.createColumnArray('Call', 'Min', 'Max', 'Average', 'Count');
      for (const c of me.TrxDataFromBackEnd.headers1[0].cols)
        me.cols.push(c);
        statusCodeIndex = -1;
        me.popupTitle = "Memcache Call Stats";
        me._selectedColumns = me.cols;
        me.backendTypeFive = true;
        me.backendTypeThree = false;
        me.backendTypeTwo = false;
        me.backendTypeTwentyTwo = false;
        me.backendTypeNine = false;
        me.backendTypeTwentyThree= false;
        me.backendTypeHTTP = false;
        me.backendTypeOne = false;
        me.backendTypeRemainingAll= false;
    }
    else if (backENDType == 2 || backENDType == 10 || backENDType == 15 || backENDType == 16 || backENDType == 18 || backENDType == 19 || backENDType == 25) {
      //this.col = this.createColumnArray('Query', 'Min', 'Max', 'Average', 'Count','ExecutionTime', 'errorCount', 'totalTime');
       for (const c of me.TrxDataFromBackEnd.panels[0].headers[0].cols)
         me.cols.push(c);
         statusCodeIndex = 8;
        this.showClipboard = true;
         me.popupTitle = "DB Requests";
         me._selectedColumns = me.cols;
         me.backendTypeTwo = true;
         me.backendTypeThree = false;
         me.backendTypeFive = false;
         me.backendTypeTwentyTwo = false;
         me.backendTypeNine = false;
         me.backendTypeHTTP = false;
         me.backendTypeTwentyThree= false;
         me.backendTypeOne = false;
         me.backendTypeRemainingAll= false;
    }
	else if (backENDType == 22) {
      //this.col = this.createColumnArray('Command', 'Min', 'Max', 'Average', 'Count','ExecutionTime', 'errorCount','statusCODE');
      for (const c of me.TrxDataFromBackEnd.headers7[0].cols)
        me.cols.push(c);
        statusCodeIndex = 7;
        me.popupTitle = "FTP Commands";
        me._selectedColumns = me.cols;
        me.backendTypeTwentyTwo = true;
        me.backendTypeTwo = false;
         me.backendTypeThree = false;
         me.backendTypeFive = false;
         me.backendTypeNine = false;
         me.backendTypeHTTP = false;
         me.backendTypeTwentyThree= false;
         me.backendTypeOne = false;
         me.backendTypeRemainingAll= false;
    }
    else if (backENDType == 9) {
      //this.col = this.createColumnArray('Query', 'Min', 'Max', 'Average', 'Count', 'errorCount');
      for (const c of me.TrxDataFromBackEnd.headers4[0].cols)
        me.cols.push(c);
        statusCodeIndex = 6;
        me.popupTitle = "Cassandra DB Request Tracing";
        me._selectedColumns = me.cols;
        me.backendTypeNine = true;
        me.backendTypeTwentyTwo = false;
        me.backendTypeTwo = false;
        me.backendTypeThree = false;
        me.backendTypeFive = false;
        me.backendTypeHTTP = false;
        me.backendTypeTwentyThree= false;
        me.backendTypeOne = false;
        me.backendTypeRemainingAll= false;
    }
    else if (obj.instanceType == 'backend' && obj.backendType == 'HTTP') {
      //this.col = this.createColumnArray('URL', 'Min', 'Max', 'Average', 'Count', 'errorCount', 'statusCODE');
      for (const c of me.TrxDataFromBackEnd.headers2[0].cols)
        me.cols.push(c);
        statusCodeIndex = 6;
        me.popupTitle = "Call Stats";
        me._selectedColumns = me.cols;
        me.backendTypeHTTP = true;
        me.backendTypeNine = false;
        me.backendTypeTwentyTwo = false;
        me.backendTypeTwo = false;
        me.backendTypeThree = false;
        me.backendTypeFive = false;
        me.backendTypeTwentyThree= false;
        me.backendTypeOne = false;
        me.backendTypeRemainingAll= false;
    }
    else if (obj.instanceType == 'backend' || backENDType == 23 || backENDType == 24 || backENDType == 26 || backENDType == 11 || backENDType == 12 || backENDType == 13 || backENDType == 14) {
      //this.col = this.createColumnArray('Min', 'Max', 'Average', 'Count', 'errorCount', 'statusCODE');
      for (const c of me.TrxDataFromBackEnd.headers3[0].cols)
        me.cols.push(c);
        statusCodeIndex = 5;
        me.popupTitle = "Call Stats";
        me._selectedColumns = me.cols;
        me.backendTypeTwentyThree = true;
        me.backendTypeHTTP = false;
        me.backendTypeNine = false;
        me.backendTypeTwentyTwo = false;
        me.backendTypeTwo = false;
        me.backendTypeThree = false;
        me.backendTypeFive = false;
        me.backendTypeOne = false;
        me.backendTypeRemainingAll= false;
    }

    /* else if(queueName != undefined)  //jms queues
     {
        this.col = ['URL','StartTime','Duration','FPInstance','CorrID','CpuTime','errorCount','statusCODE'];
            statusCodeIndex = 7;
    }*/
    else if (backENDType == 1 || obj.passedurl != '-') {
      //this.col = this.createColumnArray('URL', 'StartTime', 'Duration', 'FPInstance', 'CorrID', 'CpuTime', 'errorCount', 'statusCODE','gcpause','Action');
      for (const c of me.TrxDataFromBackEnd.headers5[0].cols)
        me.cols.push(c);
        statusCodeIndex = 7;
        me.popupTitle = "Transaction Tracing Detail";
        me._selectedColumns = me.cols;
        me.backendTypeOne = true;
        me.backendTypeTwentyThree = false;
        me.backendTypeHTTP = false;
        me.backendTypeNine = false;
        me.backendTypeTwentyTwo = false;
        me.backendTypeTwo = false;
        me.backendTypeThree = false;
        me.backendTypeFive = false;
        me.backendTypeRemainingAll= false;
    }
    else {
      //this.col = this.createColumnArray('backendType', 'backendSubType', 'Min', 'Max', 'Average', 'Count');
      for (const c of me.TrxDataFromBackEnd.headers6[0].cols)
        me.cols.push(c);
        me.popupTitle = "Transaction Tracing Detail";
        me._selectedColumns = me.cols;
        me.backendTypeRemainingAll = true;
        me.backendTypeOne = false;
        me.backendTypeTwentyThree = false;
        me.backendTypeHTTP = false;
        me.backendTypeNine = false;
        me.backendTypeTwentyTwo = false;
        me.backendTypeTwo = false;
        me.backendTypeThree = false;
        me.backendTypeFive = false;
    }
    me.showFlowpathDetailsModel = true;
    var flag = 0;
    me.flowpathDetailsService.getIndividualGroupedInfo(obj.backendType, obj.depth, obj.key, this.interceptor.transactionDataList)
    .then((json: any) => {
        console.log("getIndividualGroupedInfo", JSON.stringify(json));
        if(backENDType == 23 || backENDType == 24 || backENDType == 26 || backENDType == 11 || backENDType == 12 || backENDType == 13 || backENDType == 14){
          json = json.splice(0,1)
        }
         me.Tabledata = [];
      if(!JSON.stringify(json).includes("gcpause"))
      {
        me._selectedColumns.splice(8,1);
      }
      for (let j = 0; j < json.length; j++) {

        if (json[j].statusCODE != "" && json[j].statusCODE != undefined && json[j].statusCODE != "-" && json[j].statusCODE != "0" && json[j].statusCODE != "NaN")
          flag = flag + 1;

        var obj = {};
        obj['rspTime'] = (json[j].avg * json[j].count).toFixed(2);
        if (json[j].min < 0)
          json[j].min = 0;
        if (json[j].max < 0)
          json[j].max = 0;
        if (json[j].avg < 0)
          json[j].avg = 0;
        if (json[j].flowPathInstance < 0)
          json[j].flowPathInstance = 0;
        if (backENDType == 3 || backENDType == 5 || backENDType == 6) {
          if(isNaN(Number(json[j].avg)) ){
              continue;
          }
          if (json[j].backendSubType == "") {
            obj['Call'] =  + json[j].backendSubType + "'>" + "get0() or fetch0()"
          }
          else
            obj['call'] =  json[j].backendSubType;
          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);
          if(json[j].count != undefined)
            obj['count'] =json[j].count.toLocaleString();

          me.Tabledata.push(obj);
          this.popupFooter = 'Minimu Execution Time = '+ json[j].min;
          this.popupFilter = '';

        }
        else if (backENDType == 2 || backENDType == 10 || backENDType == 15 || backENDType == 16 || backENDType == 18 || backENDType == 19 || backENDType == 25) {
          obj['sqlquery'] =  json[j].backendQuery ;

          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);
          /*if(json[j].backendName !=undefined )
         obj.Backend = "<span  title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
         if(json[j].count != undefined)
           obj['count'] = json[j].count.toLocaleString();

         if (json[j].errorCount > 0 && json[j].errorCount != undefined)
            obj['failedcount'] = Number(json[j].errorCount);
          else
            obj['failedcount'] = " 0";

          obj['statusCODE'] = json[j].statusCODE;

          obj['totalTime'] = (Number(json[j].avg) * Number(json[j].count)).toFixed(2);

          console.log(obj);
          me.Tabledata.push(obj);
          if(j == 0)
          this.popupFooter = 'Query : '+ json[j].backendQuery;

          this.popupFilter = '';
        }
	    else if ( backENDType == 22) {
          obj['backendQuery'] =  json[j].backendQuery ;

          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);
          /*if(json[j].backendName !=undefined )
         obj.Backend = "<span  title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
         if(json[j].count != undefined)
           obj['count'] = json[j].count.toLocaleString();

         if (json[j].errorCount > 0 && json[j].errorCount != undefined)
            obj['errorCount'] = Number(json[j].errorCount);
          else
            obj['errorCount'] = " 0";

          obj['statusCODE'] = json[j].statusCODE;
          console.log(obj);
          me.Tabledata.push(obj);
          if(j == 0)
          this.popupFooter = 'Command : '+ json[j].backendQuery;

          this.popupFilter = '';
        }
        else if (backENDType == 9) {
          obj['backendQuery'] =   json[j].backendQuery;
          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);
          obj['count'] = json[j].count;
          if (json[j].errorCount > 0 && json[j].errorCount != undefined)
            obj['errorCount'] = Number(json[j].errorCount);
          else
            obj['errorCount'] = "0";
          obj['statusCODE'] = json[j].statusCODE;
          me.Tabledata.push(obj);
            //me.cols.push(c);
          if(j == 0)
          this.popupFooter = 'Query : '+ json[j].backendQuery;

          this.popupFilter = '';

        }
        else if (objForTable.instanceType == 'backend' && backENDType == 1) {
          obj['resourceName'] = json[j].resourceName;
          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);

          /*if(json[j].backendName !=undefined )
         obj.Backend = "<span title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
          obj['count'] = json[j].count;
          if (json[j].errorCount > 0 && json[j].errorCount != undefined)
            obj['errorCount'] = Number(json[j].errorCount);
          else
            obj['errorCount'] = "0";
          obj['statusCODE'] = json[j].statusCODE;
          me.Tabledata.push(obj);
          if (j == 0 && json[j].resourceName != '-' ){
            this.popupFooter ='URL = ' + json[j].resourceName;
        }
        else if(j == 0){
            this.popupFooter ='Minimum Execution Time = ' + json[j].min;
        }
          //this.setpopupFilter();

        }
        else if (objForTable.instanceType == 'backend' || backENDType == 23 || backENDType == 24 || backENDType == 26 || backENDType == 11 || backENDType == 12 || backENDType == 13 || backENDType == 14) {
          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);

          /*if(json[j].backendName !=undefined )
         obj.Backend = "<span title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/
          obj['count'] = json[j].count;
          if (json[j].errorCount > 0 && json[j].errorCount != undefined)
            obj['errorCount'] = Number(json[j].errorCount);
          else
            obj['errorCount'] = "0";
          obj['statusCODE'] = json[j].statusCODE;
          me.Tabledata.push(obj);
          if(j == 0)
          this.popupFooter ='Minimum Execution Time = ' + json[j].min;
          //this.setpopupFilter();

        }
        else if (backENDType == 1 || objForTable.passedURL != '-') {
          this.popupTitle = "FlowPaths " + "( " + "Tier: "+json[j].tierName + ", "+"Server: " + json[j].serverName +", "+ "Instance : " + json[j].appName + " )";

          obj['url'] =  json[j].url ;
          if (json[j].min != undefined && json[j].min != "")
            obj['min'] = Number(json[j].min);
          if (json[j].max != undefined && json[j].max != "")
            obj['max'] = Number(json[j].max).toLocaleString();
          obj['avg'] = Number(json[j].avg).toFixed(2);
          /*  obj.Tier = json[j].tierName;
           obj.Server = json[j].serverName;
           obj.Instance = json[j].appName; */
          obj['flowPathInstance'] = json[j].flowPathInstance;
          obj['startTime'] = json[j].startTime;

          //<------adding some usefull data in json which will help in navigating on futher reports --
          obj['startTimeInMs'] = json[j].startTimeInMs;
          obj['fpDurationExact'] = json[j].fpDuration;
          obj['tierName'] = json[j].tierName;
          obj['serverName'] = json[j].serverName;
          obj['instanceName'] = json[j].appName;
          obj['tierId'] = json[j].tierId;
          obj['serverId'] = json[j].serverId;
          obj['appId'] = json[j].appId;
          obj['urlIndex'] = json[j].urlIndex;
          obj['threadID'] = json[j].threadID;
                                              // ---till here-------!!!!!!!>

          obj['fpDuration'] = json[j].fpDuration.toLocaleString();
          if(json[j].gcpause == "1")
           obj['gcpause'] = "Yes";
          else
           obj['gcpause'] = "No" ;
          if (json[j].correlationid != undefined)
            obj['correlationid'] = json[j].correlationid;
          else
            obj['correlationid'] = "-";
          obj['btcputime'] = Math.round(json[j].btcputime);
          obj['url'] = json[j].urlQueryParmStr;
          var strEndTime = Number(json[j].startTimeInMs) + Number(json[j].fpDuration);
          if (json[j].errorCount > 0 && json[j].errorCount != undefined)
            obj['errorCount'] = Number(json[j].errorCount);
          else
            obj['errorCount'] = "0";
          obj['statusCODE'] = json[j].statusCODE;

          me.Tabledata.push(obj);
          if(j == 0)
          this.popupFooter ='URL = ' +  json[j].url;

          this.popupFilter = '';

        }
        else {
          //col = ['BackendType', 'BackendSubType', 'Min','Max', 'Average', 'Count'];
          obj['backendType'] =  json[j].backendType + "'>" + json[j].backendType ;
          if (json[j].backendSubType != undefined)
            obj['backendSubType'] =   json[j].backendSubType + "'>" + json[j].backendSubType ;
          obj['min'] = json[j].min;
          obj['max'] = json[j].max;
          obj['avg'] = Number(json[j].avg).toFixed(2);

          /*if(json[j].backendName !=undefined )
            obj.Backend = "<span title = '"+json[j].backendName+"'>"+json[j].backendName+"</span>";*/

          obj['count'] = json[j].count;
          if(j == 0)
          this.popupFooter ='Minimum Execution Time = ' + json[j].min;

          this.popupFilter = '';

        }
      }
           if(flag == 0 && statusCodeIndex != -1)
              {
                 me._selectedColumns.splice(statusCodeIndex,1);
              }
            if(me.Tabledata[0] != undefined && me.Tabledata[0].flowPathInstance != undefined)
              me._selectedColumns.splice(3,3);

      // this.tableDialogDisplay = true;
      // this.tableDialogDisplay1 = false;
      // this.singleMergeGraph = false;
      // this.displaySamplePopup = false;
      this.dbCalloutDetails = this.Tabledata;
      //me.showFlowpathDetailsModel = true;
      console.log("Table json obj data : ", me.Tabledata);
      setTimeout(() => {
        console.log("data for table", me._selectedColumns, me.Tabledata);
        this.createTable(me._selectedColumns, me.Tabledata);
      }, 200)

      }
    );
  }

  createTable(columns, data) {
    for (let i = 0; i < data.length; i++) {
     this.transactionTableArray = this.Immutablepush(this.transactionTableArray, data[i]);
     console.log("TrxnTableArray = ", this.transactionTableArray );
    }
  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }
  onRowClick(label, data){
    console.log('event of on row click', data);
    if(label == 'Query'){
      this.popupFooter = 'Query : ' + data.sqlquery;
    }
    else if(label == 'URL'){
      if(data.url){
       this.popupFooter = 'URL = ' + data.url;
      }else{
        this.popupFooter = 'URL = ' + data.resourceName;
      }
    }
    else{
      if(label == 'Min(ms)'){
        this.popupFooter = 'Minimum Execution Time : ' + data.min;
      }

    }
  }
  openMethodCallingTree(data){
    const me = this;
    console.log("Inside the Method Calling tree method : ", data);
    me.sessionService.setSetting("TrxnMCTtable", data);
    me.sessionService.setSetting("reportID", "isFromTrxnTableMCT");
    me.sessionService.setSetting("isSource", "isFromTableDataMCT");
    me.isShowMCTTable = true;
  }
  openMethodTimingReport(rowData){
   const me = this;
   console.log("Inside the Method Timing report : ", rowData);
   me.sessionService.setSetting("TrxnMTtable", rowData);
   me.sessionService.setSetting("reportID", "isFromTrxnTableMT");
  //  me.sessionService.setSetting("isSource", "isFromTableDataMT");
   me.isShowMTTable = true;
  }
  openHotspotReport(rowData){
   const me = this;
   console.log("Inside the Hotspot report : ", rowData);
   me.sessionService.setSetting("TrxnHSTtable", rowData);
   me.sessionService.setSetting("reportID", "isFromTrxnTableHST");
   me.sessionService.setSetting("isSource", "isFromTableDataHST");
   me.isShowHsTable = true;
  }
  openDBReports(rowData){
   const me = this;
   console.log("Inside the DB report : ", rowData);
   me.sessionService.setSetting("TrxnDBtable", rowData);
   me.sessionService.setSetting("reportID", "isFromTrxnTableDB");
   me.sessionService.setSetting("isSource", "isFromTableDataDB");
   me.isShowDbTable = true;
  }
  openReqRespData(rowData){

  }
  openReqRespDataForCallOut(rowData){

  }
  downloadReportForAgg(label) {
    const me = this;
    // let tableData = me.data.panels[0].data;
    let reportTitle = this.popupTitle;
    let tableData:any[] = me.dbCalloutDetails;
    console.log("table Data:---", tableData);
    let header = [];
    let headerValField = [];
    let rowData:any[]=[];
    header.push("S No.");
    if(me.backendTypeThree === true || me.backendTypeFive === true){
    for (const c of me.selectedColumns){
        header.push(c.label);
      }
    for(let i =0;i<tableData.length;i++){
      //  for(let j=0 ; j<me.selectedColumns.length ; j++){
      //    if(me.selectedColumns[j].valueField == tableData[i]['keys']){
      //       me.selectedColumns[j].valueField = tableData[i];
      //       let rData:any[]=[];
      //       let number = j+1;
      //       rData.push(number.toString());
      //       rData.push(me.selectedColumns[i].valueField);
      //       console.log("value for data table:====", tableData[i], me.selectedColumns[j].valueField, rData);

      //       rowData.push(rData);
      //    }
      //  }
      let rData:any[]=[];
      let number = i+1;
      rData.push(number.toString());
      rData.push(tableData[i].backendSubType);
      rData.push(tableData[i].min);
      rData.push(tableData[i].max);
      rData.push(tableData[i].avg);
      rData.push(tableData[i].count);

      rowData.push(rData);
      }
    }
    if(me.backendTypeTwo === true){
        for (const c of me.selectedColumns){
            header.push(c.label);
          }
        for(let i =0;i<tableData.length;i++){
          let rData:any[]=[];
          let number = i+1;
          rData.push(number.toString());
          rData.push(tableData[i].sqlquery);
          rData.push(tableData[i].min);
          rData.push(tableData[i].max);
          rData.push(tableData[i].avg);
          rData.push(tableData[i].count);
          rData.push(tableData[i].rspTime);
          rData.push(tableData[i].failedcount);
          rData.push(tableData[i].totalTime);

          rowData.push(rData);
          }
        }
        if(me.backendTypeTwentyTwo === true){
          for (const c of me.selectedColumns){
              header.push(c.label);
            }
          for(let i =0;i<tableData.length;i++){
            let rData:any[]=[];
            let number = i+1;
            rData.push(number.toString());
            rData.push(tableData[i].min);
            rData.push(tableData[i].max);
            rData.push(tableData[i].avg);
            rData.push(tableData[i].count);
            rData.push(tableData[i].cumsqlexectime);
            rData.push(tableData[i].errorCount);
            rData.push(tableData[i].statusCODE);

            rowData.push(rData);
            }
          }
          if(me.backendTypeNine === true){
            for (const c of me.selectedColumns){
                header.push(c.label);
              }
            for(let i =0;i<tableData.length;i++){
              let rData:any[]=[];
              let number = i+1;
              rData.push(number.toString());
              rData.push(tableData[i].backendQuery);
              rData.push(tableData[i].min);
              rData.push(tableData[i].max);
              rData.push(tableData[i].avg);
              rData.push(tableData[i].count);
              rData.push(tableData[i].errorCount);

              rowData.push(rData);
              }
            }
            if(me.backendTypeHTTP === true){
              for (const c of me.selectedColumns){
                  header.push(c.label);
                }
              for(let i =0;i<tableData.length;i++){
                let rData:any[]=[];
                let number = i+1;
                rData.push(number.toString());
                rData.push(tableData[i].resourceName);
                rData.push(tableData[i].min);
                rData.push(tableData[i].max);
                rData.push(tableData[i].avg);
                rData.push(tableData[i].count);
                rData.push(tableData[i].errorCount);
                rData.push(tableData[i].statusCODE);

                rowData.push(rData);
                }
              }
              if(me.backendTypeTwentyThree === true){
                for (const c of me.selectedColumns){
                    header.push(c.label);
                  }
                for(let i =0;i<tableData.length;i++){
                  let rData:any[]=[];
                  let number = i+1;
                  rData.push(number.toString());
                  rData.push(tableData[i].min);
                  rData.push(tableData[i].max);
                  rData.push(tableData[i].avg);
                  rData.push(tableData[i].count);
                  rData.push(tableData[i].errorCount);
                  rData.push(tableData[i].statusCODE);

                  rowData.push(rData);
                  }
                }
                if(me.backendTypeOne === true){
                  for(let i=0; i<me.selectedColumns.length-1; i++){
                   header.push(me.selectedColumns[i].label);
                   headerValField.push(me.selectedColumns[i].label);
                  }
                  for(let i =0;i<tableData.length;i++){
                    let rData:any[]=[];
                    let number = i+1;
                    rData.push(number.toString());
                    for(let j=0; j<headerValField.length; j++){
                    if(headerValField[j] === 'URL')
                    rData.push(tableData[i].url);
                    else if(headerValField[j] === 'Start Time')
                    rData.push(tableData[i].startTime);
                    else if(headerValField[j] === 'Duration(ms)')
                    rData.push(tableData[i].fpDuration);
                    else if(headerValField[j] === 'Flowpath ID')
                    rData.push(tableData[i].flowPathInstance);
                    else if(headerValField[j] === 'CorrID')
                    rData.push(tableData[i].correlationid);
                    else if(headerValField[j] === 'CPU Time(ms)')
                    rData.push(tableData[i].btcputime);
                    else if(headerValField[j] === 'Error Count(s)')
                    rData.push(tableData[i].errorCount);
                    else if(headerValField[j] === 'Status Code(s)')
                    rData.push(tableData[i].statusCODE);
                    else if(headerValField[j] === 'GC Pause')
                    rData.push(tableData[i].gcpause);
                    else if(headerValField[j] === 'Action')
                    rData.push(tableData[i].action);
                    }
                    rowData.push(rData);
                    }
                  }
                  if(me.backendTypeRemainingAll === true){
                    for (const c of me.selectedColumns){
                        header.push(c.label);
                      }
                    for(let i =0;i<tableData.length;i++){
                      let rData:any[]=[];
                      let number = i+1;
                      rData.push(number.toString());
                      rData.push(tableData[i].backendType);
                      rData.push(tableData[i].backendSubType);
                      rData.push(tableData[i].min);
                      rData.push(tableData[i].max);
                      rData.push(tableData[i].avg);
                      rData.push(tableData[i].count);

                      rowData.push(rData);
                      }
                    }


    try {
      me.flowpathDetailsService.downloadShowDescReports(label, rowData, header, reportTitle).subscribe(
        (state: Store.State) => {
          if (state instanceof DownloadReportLoadingState) {
            me.onLoadingReport(state);

            return;
          }

          if (state instanceof DownloadReportLoadedState) {
            me.onLoadedReport(state);
            return;
          }
        },
        (state: DownloadReportLoadingErrorState) => {
          me.onLoadingReportError(state);

        }
      );
    } catch (err) {
      console.log("Exception in downloadReportForAgg method in Trxn Flowmap report component :", err);
    }
  }

  private onLoadingReport(state: DownloadReportLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onLoadedReport(state: DownloadReportLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let path = state.data.comment.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");

  }
  private onLoadingReportError(state: DownloadReportLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }
}
