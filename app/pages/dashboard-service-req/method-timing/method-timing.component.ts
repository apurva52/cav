 import {
  Component,
   ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { LazyLoadEvent ,MenuItem } from 'primeng';
import { FilterUtils } from 'primeng/utils';
import { MethodTimingService } from './service/method-timing.service';
import {
  MethodTimingLoadingState,
  MethodTimingLoadedState,
  MethodTimingLoadingErrorState,
  DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState
} from './service/method-timing.state';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { MethodTimingData,ServiceMethodTimingParams } from './service/method-timing.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { DdrPipe } from 'src/app/shared/pipes/ddr-pipes/ddr.pipe';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { Subscription } from 'rxjs';
import { GlobalDrillDownFilterService } from 'src/app/shared/global-drilldown-filter/service/global-drilldown-filter.service';
import { SessionService } from 'src/app/core/session/session.service';
import { DDRRequestService } from '../../../pages/tools/actions/dumps/service/ddr-request.service';
import { CommonServices } from '../../../pages/tools/actions/dumps/service/common.services';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-method-timing',
  templateUrl: './method-timing.component.html',
  styleUrls: ['./method-timing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class MethodTimingComponent implements OnInit {
  data: MethodTimingData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  stateID: string;

  downloadOptions: MenuItem[];
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];


  isCheckbox: boolean;
  finalValue: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  isOn: boolean;
  isShowSearch: boolean;
  inputValue: any;
  allmenuOptions: MenuItem[];
  ignoreFlag: boolean = false;
  valuechbx: boolean = false;
  methodID:number;

  serviceMethodparams:ServiceMethodTimingParams ={};

  subscribeMethodTiming : Subscription;
  @Output() rowClick = new EventEmitter<boolean>();
  totalRecords: any;
  MTDataTemp: any[];
  methodtimingData: any[];
  updatedMTdata: any;
  methodCount: String;
  pointName: string = "";
  productName: string;
  queryParams:any;
  testRun: string;
  agentType:string;
  showAutoInstrPopUp:boolean = false;
  displayAutoInst :boolean = false;
  argsForAIDDSetting:any[];
  vecId:any;
  mtFilter: any = {};
  tableDataAll:any[];
  restgrphdata:any;
  refreshTable:boolean = false;
  breadcrumb: BreadcrumbService;
  showPagination: boolean = false;

  @ViewChild("methodTiming") methodTiming: ElementRef;
  globalFilterFields: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  constructor(private methodTimingService: MethodTimingService,
              private f_ddr: DdrPipe,
              private dashboardServiceReqService:DashboardServiceReqService,
	      private globalDrillDownFilterService:GlobalDrillDownFilterService,
        private sessionService: SessionService,
        private ddrRequest:DDRRequestService,
        private commonService: CommonServices,
        private route: ActivatedRoute,
        breadcrumb: BreadcrumbService) {
          this.breadcrumb = breadcrumb;
          this.route.queryParams.subscribe((params) => {
            this.stateID = params['state'];
           });
        }

  ngOnInit(): void {
    const me = this;
    me.testRun = me.sessionService.testRun.id; //testrun
    me.productName = me.sessionService.session.cctx.prodType; // product name. 
    me.queryParams = me.sessionService.getSetting("fpRowdata"); //stores current flowpath row data.
    this.globalDrillDownFilterService.currentReport = "Method Timing";
    this.subscribeMethodTiming = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance;
      me.load();
  });
    this.subscribeMethodTiming = this.globalDrillDownFilterService.sideBarUIObservable$.subscribe((temp) => {
    if (this.globalDrillDownFilterService.currentReport == "Method Timing") {
      me.load(temp);
    }
  });
    me.load();

    me.downloadOptions = [
      {
        label: 'WORD',
        command: () => {
          const me = this;
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'EXCEL',
        command: () => {
          const me = this;
          me.downloadShowDescReports("excel");
        }
      },
      {
        label: 'PDF',
        command: () => {
          const me = this;
          me.downloadShowDescReports("pdf");
      }
      }
    ]

    me.allmenuOptions = [
      {
        label: 'Start Instrumentation',
        command: (event: any) => {
          this.openAutoInstDialog();
        },
      },
      {
        label: 'Execute Level1 Flowpath',
        command: (event: any) => {
          me.ignoreFlag = true;
        },
      },
      {
        label: 'Show summary of all packages',
        command: (event: any) => {
          me.openSummaryPackages();
        },
      },
      {
        label: 'Show summary of all classes',
        command: (event: any) => {
          me.openSummaryClasses();
        },
      },
      {
        label: 'Show summary of all Methods',
        command: (event: any) => {
          me.openSummaryMethods();
        },
      },
    ]

    if (this.methodTimingService.isSource == "widget" && me.methodTimingService.reportID == "MT" ) {
      me.breadcrumb.add({label: 'Method Timing', routerLink: '/dashboard-service-req/method-timing', queryParams: { state: me.stateID} } as MenuItem);
      this.getVectorIds();
    } else if(this.methodTimingService.isSource == "widget" && me.methodTimingService.reportID == "FP"){
      me.breadcrumb.add({label: 'Aggregate Method Timing', routerLink: '/dashboard-service-req/method-timing', queryParams: { state: me.stateID} } as MenuItem);
    }
  }

  load(cqmFilter?) {
    const me = this;
    if(cqmFilter) {
      me.methodTimingService.loadFromCqm(cqmFilter).subscribe(
        (state: Store.State) => {
          if (state instanceof MethodTimingLoadingState) {
            me.onLoading(state);
            return;
          }
  
          if (state instanceof MethodTimingLoadedState) {
            me.onLoaded(state);
            return;
          }
        },
        (state: MethodTimingLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }
    else {
    me.methodTimingService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof MethodTimingLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof MethodTimingLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: MethodTimingLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    }
  }

  private onLoading(state: MethodTimingLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: MethodTimingLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: MethodTimingLoadedState) {
    const me = this;
    me.data = state.data;
    me.tableDataAll = me.data.panels[0].data;
    me.restgrphdata = me.data.panels[0].restData;
    me.error = null;
    me.loading = false;
    if (me.data) {
      me.methodCount = " (Total: "+me.data.panels[0].data.length+")";
     this.updatedMTdata = this.doHyperLinkOnMethod(this.data.panels[0].data);
      // let check = {}
      // me.loadPagination(check);
      me.totalRecords = this.data.panels[0].data.length;
      if(!me.totalRecords) {
        me.emptyTable = true;
      }
      me.empty = false;
    } else {
      me.empty = true;
    }
    me.cols = me.data.panels[0].headers[0].cols;
    me._selectedColumns =[];
    for (const c of me.data.panels[0].headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    if( me.data.panels[0].data.length > me.data.panels[0].paginator.rows){
      me.showPagination = true;
    }
  }

  // toggleFilter(filterToToggle: MethodTimingFilter) {
  //   const me = this;

  //   for (const filter of me.data.filters) {
  //     if (filterToToggle.key === filter.key) {
  //       filter.selected = !filter.selected;
  //       break;
  //     }
  //   }

  //   const payload: MethodTimingLoadPayload = {
  //     filters: me.data.filters,
  //   };

  //   me.load(payload);
  // }

  // clearFilters() {
  //   const me = this;
  //   me.inputValue = document.querySelector('.search-box');
  //   me.inputValue.value = '';
  // }
  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }

      /**Used to hyper link method for opening service method timing report
    This is used to check codition of package and class based on which method name is appended with %40 to show hyperlink on table */
    doHyperLinkOnMethod(val): any {
      for (let i = 0; i < val.length; i++) {
          if (val[i]["pN"] == "weblogic.servlet.internal" && val[i]["cN"] == "FilterChainImpl")
              val[i]["mN"] = val[i]["mN"] + "%40";
          else if (val[i]["pN"] == "javax.servlet.http" && val[i]["cN"] == "HttpServlet")
              val[i]["mN"] = val[i]["mN"] + "%40";
          else if (val[i]["pN"] == "com.sun.jersey.spi.container.servlet" && val[i]["cN"] == "WebComponent")
              val[i]["mN"] = val[i]["mN"] + "%40";
          else if (val[i]["pN"] == "org.glassfish.jersey.servlet" && val[i]["cN"] == "ServletContainer")
              val[i]["mN"] = val[i]["mN"] + "%40";
          else if (val[i]["pN"] == "weblogic.servlet.jsp" && val[i]["cN"] == "JspBase")
              val[i]["mN"] = val[i]["mN"] + "%40";
          else if (val[i]["pN"] == "org.apache.jasper.runtime" && val[i]["cN"] == "HttpJspBase")
              val[i]["mN"] = val[i]["mN"] + "%40";
      }
      return val;
  }

  // filterField(row, filter) {
  //   let isInFilter = false;
  //   let noFilter = true;
  //   for (var columnName in filter) {
  //     if (row[columnName] == null) {
  //       return;
  //     }
  //     noFilter = false;
  //     let rowValue: String = row[columnName].toString().toLowerCase();
  //     let filterMatchMode: String = filter[columnName].matchMode;
  //     if (
  //       filterMatchMode.includes('contain') &&
  //       rowValue.includes(filter[columnName].value.toLowerCase())
  //     ) {
  //       isInFilter = true;
  //     } else if (
  //       filterMatchMode.includes('custom') &&
  //       rowValue.includes(filter[columnName].value)
  //     ) {
  //       isInFilter = true;
  //     }
  //   }
  //   if (noFilter) {
  //     isInFilter = true;
  //   }
  //   return isInFilter;
  // }

  // sortField(rowA, rowB, field: string): number {
  //   if (rowA[field] == null) return 1;

  //   if (field === "eC" || field === "variance") {
  //     if (Number(rowA[field]) > Number(rowB[field])) return 1;
  //     else return -1;
  //   }
  //  else if (field == "avgST" || field == "avgCPUST" || field == "percent" || field == "avgWT" || field == "sTOrg" || field == "totWT"  || field == "cumCPUST" ) {
  //     if (parseFloat(rowA[field]) > parseFloat(rowB[field])) return 1;
  //     else return -1;
  //   }
  //   else {
  //     return rowA[field].localeCompare(rowB[field]);
  //   }
  // }

  // loadPagination(event: LazyLoadEvent) {
  //   this.loading = true;
  //   console.log(event);
    
  //   setTimeout(() => {
  //     if (this.data.panels[0].data) {
  //       this.MTDataTemp = this.data.panels[0].data.filter((row) =>
  //         this.filterField(row, event.filters)
  //       );
       
  //       this.MTDataTemp.sort(
  //         (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
  //       );
        
  //       this.methodtimingData = this.MTDataTemp.slice(
  //         event.first,
  //         event.first + event.rows
  //       );   

  //       this.loading = false;
  //     }
  //   }, 1000);
  // }

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        let operator1 = filter.slice(0, 2);
        let operator2 = filter.slice(0, 1);

        // Filter if value >= ,<=, =
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length)).toFixed(3);
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length)).toFixed(3);
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length)).toFixed(3);
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)).toFixed(3) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') == -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter).toFixed(3);
        }
      }
      return me.finalValue;
    };
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  serviceMethodTiming($event) {
    this.isOn = $event;
  }

  openServiceMethodtiming($event) {
    this.isOn = $event;
  }

  openServiceMT( rowData: any) {
    const me =this;
    console.log("roooooooowdattttttaaa",rowData);
    me.serviceMethodparams = me.methodTimingService.serviceMTParams;
    me.serviceMethodparams.methodID= rowData["ID"];
   // me.methodID = rowData["ID"];
    this.isOn = true;
    this.rowClick.emit(this.isOn)
  }

  openSMT(event) {
    console.log(event);
  }

  ngOnDestroy() {
    this.subscribeMethodTiming.unsubscribe();
  }

  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.panels[0].data;
    let header = [];
    header.push("S No.");

    for (const c of me.data.panels[0].headers[0].cols)
        header.push(c.label);

    try {
      me.methodTimingService.downloadShowDescReports(label, tableData,header).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Method Timing report component :", err);
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

  getVectorIds() {
    this.queryParams = {};
    this.mtFilter = this.sessionService.getSetting("cqmPayload");
    if(this.commonService.isValidParameter(this.mtFilter['serverName']) && this.commonService.isValidParameter(this.mtFilter['appName'])) 
    { let urlForid;
        this.displayAutoInst = true;
        urlForid = this.getHostUrl()+ "/" + this.productName.toLowerCase().replace("/", "") + "/analyze/drill_down_queries/" + "NDAjaxController.jsp?strOperName=getTSAname&testRun=" + this.sessionService.testRun.id + "&tierName=" + this.mtFilter['tierName'] + "&serverName=" + this.mtFilter['serverName'] + "&appName=" + this.mtFilter['appName'];
    
          this.ddrRequest.getDataInStringUsingGet(urlForid).subscribe(data => {
          this.getAgentInfo(data)
        });
        return;
    }
    else
    {
      this.displayAutoInst = false;
    }
  }
  
  /** Auto Instrumentation DDAI */
  getIdFortier(data) {
    return data.trim().split(":");
  }

  getAgentInfo(res:any) {
    this.vecId = this.getIdFortier(res);
    this.queryParams['tierId'] = this.vecId[0].trim();
    this.queryParams['serverId'] = this.vecId[1].trim();
    this.queryParams['appId'] = this.vecId[2].trim();
    this.queryParams['appName'] = this.mtFilter['appName'];
    this.queryParams['serverName'] = this.mtFilter['serverName'];
    this.queryParams['tierName'] = this.mtFilter['tierName'];
    this.queryParams['url'] = this.mtFilter['url'];
    let url
    url = this.getHostUrl()+ "/"+ this.productName.toLowerCase().replace("/","") + "/v1/cavisson/netdiagnostics/ddr/getAgent?testRun=" + this.sessionService.testRun.id +
    "&tierId=" + this.vecId[0].trim() + "&serverId=" + this.vecId[1].trim() + "&appId=" + this.vecId[2].trim();

    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data=>{
      console.log("data for Agent = " , data);
      this.agentType = data;
      this.queryParams['Instance_Type'] = this.agentType;
    });
  }

  openAutoInstDialog() {
    console.log("query params---",this.queryParams);
    let testRunStatus;
    let AgentType;
    let url
    url = this.getHostUrl() + '/' + this.productName.toLowerCase().replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/getTestRunStatus?testRun=' + this.sessionService.testRun.id;
      this.ddrRequest.getDataUsingGet(url).subscribe(res => {
      testRunStatus = <any> res;
      testRunStatus = testRunStatus.data;
      if(testRunStatus.length != 0)
      {
        if(this.queryParams && this.queryParams.Instance_Type){
          this.agentType= this.queryParams.Instance_Type;
        } else {
          console.log("agent Type  = ", this.agentType)
          this.agentType = this.agentType;
        }

        if(this.agentType.toLowerCase() == 'java')
        AgentType = 'Java';
        else if (this.agentType.toLowerCase() == 'dotnet')
        AgentType = 'DotNet';
        
        this.showAutoInstrPopUp = true;

        this.argsForAIDDSetting = [this.queryParams.appName,this.queryParams.appId,AgentType,this.queryParams.tierName,
          this.queryParams.serverName,this.queryParams.serverId,"-1",this.queryParams.url,"DDR",testRunStatus[0].status,this.sessionService.testRun.id];           
        console.log('this.argsForAIDDSetting>>>>>>>>>>>>****',this.argsForAIDDSetting);

      } else {
        this.showAutoInstrPopUp = false;
        alert("Could not start instrumentation, test is not running")
        return;
      }
    }); 
  }
  
  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
    // console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  startInstrumentation(result)
  {
    this.showAutoInstrPopUp = false;
    alert(result);
  }

  closeAIDDDialog(isCloseAIDDDialog){
    this.showAutoInstrPopUp = isCloseAIDDDialog;
  }

  applyIgnoreFP(){
    const me = this;
    me.loading = true;
    me.ignoreFlag = false;
    me.methodTimingService.min_methods = "2";
    me.load();
  }

  openSummaryPackages(){
    const me = this;
    me.methodTimingService.type = "package";
    me.methodTimingService.entity = "2";
    me.load();
  }

  openSummaryClasses(){
    const me = this;
    me.methodTimingService.type = "class";
    me.methodTimingService.entity = "1";
    me.load();
  }
  
  openSummaryMethods(){
    const me = this;
    me.methodTimingService.type = "method";
    me.methodTimingService.entity = "0";
    me.load();
  }

  clickHandler(event, index){
    const me =this;
    let filteredData = [];
    if(index == 0){ // for perc chart
      if (event.point.name == "others") {
        me.tableDataAll = me.restgrphdata['mtperc'];
      }else{
        me.data.panels[0].data.forEach((val, index)=>{
          if (val['eN'].indexOf(event.point.name)!= -1 && val['percent'] == event.point.options.y)
                filteredData.push(val);  
        });
      }
    }else{ //for count chart
      if (event.point.name == "others") {
        me.tableDataAll = me.restgrphdata['mtcount'];
      }else{
        me.data.panels[0].data.forEach((val, index)=>{
          if (val['eN'].indexOf(event.point.name)!= -1 && val['eC'] == event.point.options.y)
                filteredData.push(val);  
        });
      }
      
    }
    if(filteredData.length>0){
      me.tableDataAll = filteredData;
    }
    me.methodCount = " (Total: "+me.tableDataAll.length+")";
    me.pointName = "[ " + event.point.name + " ]";
    me.refreshTable = true;
  }
  refreshData(){
    const me = this;
    me.tableDataAll = me.data.panels[0].data;
    me.refreshTable = false;
    me.methodCount = " (Total: "+me.tableDataAll.length+")";
    me.pointName = "";
  }

}
