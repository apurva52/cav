import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  AfterContentChecked,
  AfterViewChecked,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { DashboardServiceReq } from './service/dashboard-service-req.model';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { SessionService } from 'src/app/core/session/session.service';
import { WidgetDrillDownMenuItem } from 'src/app/shared/dashboard/widget/widget-menu/service/widget-menu.model';
import { FlowPathService } from '../drilldown/flow-path/service/flow-path.service';
import { BusinessTransactionJacketComponent } from './business-transaction-jacket/business-transaction-jacket.component';
import { FlowPathTable } from '../drilldown/flow-path/service/flow-path.model';
import { IDGenerator } from 'src/app/shared/utility/IDGenerator';
import { HttpReportService } from './http-report/service/http-report.service';
import { DbQueriesService } from './db-queries/service/db-queries.service';
import { HttpReportComponent } from './http-report/http-report.component';
import { ExceptionComponent } from './exception/exception.component';
import { DbQueriesComponent } from './db-queries/db-queries.component';
import { DashboardServiceReqService } from 'src/app/pages/dashboard-service-req/service/dashboard-service-req.service';
import {
  DashboardServiceReqLoadingState,
  DashboardServiceReqLoadedState,
  DashboardServiceReqLoadingErrorState,
} from './service/dashboard-service-req.state';
import { Store } from 'src/app/core/store/store';
import { DashboardDataLoadedState, DashboardDataLoadingErrorState } from '../my-library/dashboards/service/dashboards.state';
import { DashboardCreatingErrorState, DashboardLoadedState } from 'src/app/shared/dashboard/service/dashboard.state';
import { DatePipe } from '@angular/common';
import { DDRRequestService } from '../ddr/services/ddr-request.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-dashboard-service-req',
  templateUrl: './dashboard-service-req.component.html',
  styleUrls: ['./dashboard-service-req.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class DashboardServiceReqComponent implements OnInit {
  empty: boolean;
  widgetReportItems: MenuItem[];
  isShow: boolean;
  isFromFP: boolean;
  // breadcrumb: MenuItem[] = [];
  rowID: number;
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  readonly home = { icon: 'pi pi-home', url: '#/home/dashboard' };
  menuItems: MenuItem[];
  activeTab: MenuItem;
  stateID: string;
  selectedTabName: string;
  id: string; 
  selectedData: any;
  fpDataID: string;
  data:any=[];
  error:any;
  loading:boolean=false;
  selectedFilter1:any;
  reportID: string;
  isFromSource: string;
  isFromDBG = false;
  isFromMT = false;
  timeVarienceForNF: string;
  productName: string;
  NVUrl: any;
  // selectedFilter =
  //   'Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All';

    showTabMenu = true;
  @ViewChild(BusinessTransactionJacketComponent, { read: BusinessTransactionJacketComponent })
  private businessTransactionJacketComponent: BusinessTransactionJacketComponent;

  @ViewChild(HttpReportComponent, { read: HttpReportComponent })
  private httpReportComponent: HttpReportComponent;

  @ViewChild(ExceptionComponent, { read: ExceptionComponent })
  private exceptionComponent: ExceptionComponent;

  @ViewChild(DbQueriesComponent, { read: DbQueriesComponent })
  private dbQueriesComponent: DbQueriesComponent;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private flowPathService: FlowPathService, 
    public datepipe: DatePipe,
    private dashboardServiceReqService:DashboardServiceReqService,
    public breadcrumb: BreadcrumbService,
    private ddrRequest:DDRRequestService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.stateID = params['state'],
      this.rowID = params['rowID'],
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    const me = this;
    me.productName = me.sessionService.session.cctx.prodType; // product name. 
    this.isFromFP =false;
    this.load();
    me.loadAfterLeftPanel(me.fpDataID, this.stateID);
    if( me.sessionService.getSetting("ddrSource") == "flowpath")
    {
      this.isFromFP =true;
    } 
    // else {
    //   me.breadcrumb.removeAll();
    //   me.breadcrumb.addNewBreadcrumb({label: 'Home', routerLink: '/home'} as MenuItem);
    // }
    console.log("breadcrumb value---",me.breadcrumb);
    // if( me.sessionService.getSetting("ddrSource") == "flowpath")
    // {
    //   this.isFromFP =true;
    //   me.breadcrumb = [
    //     { label: 'Home', routerLink: '/home/dashboard' },
    //     { label: 'Drill Down Flow Paths',       
    //       command: (event: any) => {
    //         me.router.navigate(['/drilldown'], { queryParams: { state: me.stateID } });
    //       },
    //     },
    //     { label: me.selectedTabName },
    //   ];
    // } else {
    //   me.breadcrumb = [
    //     { label: 'Home', routerLink: '/home/dashboard' },
    //     { label: me.selectedTabName },
    //   ];
    // }

    // me.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(
    //     () => (me.breadcrumb = me.createBreadcrumbs(me.route.root))
    // );

    if (me.stateID != null && me.rowID != null) {
      me.isShow = false;
    } else {
      me.isShow = true;
    }
    //me.loadAfterLeftPanel(null, null);
  }

  getRowData() {
    const me = this;
    me.selectedData =  me.businessTransactionJacketComponent.selectedData;
    me.fpDataID = 'fpRowData' + '-' + IDGenerator.newId();
    me.sessionService.setSetting('fpRowdata', me.selectedData);
   this.dashboardServiceReqService.splitViewUI$.next();
    me.loadAfterLeftPanel(me.fpDataID, this.stateID);
  }
  
  loadAfterLeftPanel(fpDataID, stateID) {
    const me = this;  
    
    me.widgetReportItems = [
      {
        label: 'Method Call Details',
        id: 'MCD',        
        command: (event: any) => {          
          me.router.navigate(['/dashboard-service-req/method-call-details'], { queryParams: { state: stateID, fpData: fpDataID,  id: 'MCD' }});
        },
      },
      {
        label: 'HotSpot',
        id: 'HOTSPOT',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/hotspot'], { queryParams: { state: stateID, fpData: fpDataID, id: 'HOTSPOT' } });
        },
      },
      {
        label: 'DB Queries',
        id: 'DBR',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/db-queries'], { queryParams: { state: stateID, fpData: fpDataID, id: 'DBR' } });
        },
      },
      {
        label: 'HTTP Report',
        id: 'HTTP',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/http-report'], { queryParams: { state: stateID, fpData: fpDataID, id: 'HTTP'} });
        },
      },
      {
        label: 'Exception',
        id: 'EXC',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/exception'], { queryParams: { state: stateID, fpData: fpDataID, id: 'EXC' } });
        },
      },
      {
        label: 'Method Timing',       
        id: 'MT',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/method-timing'], { queryParams: { state: stateID, fpData: fpDataID, id: 'MT' } });
        },
      },
      {
        label: 'IP Summary',
        id: 'IP',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/ip-summary'], { queryParams: { state: stateID, fpData: fpDataID, id: 'IP' } });
        },
      },
      {
	label: 'Transaction Flowmap',
        id: 'ATF',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/transaction-flowmap'], { queryParams: { state: stateID, fpData: fpDataID, id: 'ATF' } });
        },
      },
      {

        label: 'Sequence Diagram',
        id: 'SD',
        command: (event: any) => {
          me.router.navigate(['/dashboard-service-req/sequence-diagram'], { queryParams: { state: stateID, fpData: fpDataID, id: 'SD' } });
        },
      },
     
    ];

    const state: WidgetDrillDownMenuItem = me.sessionService.getSetting(me.stateID, null);

    for (const reportItems of  me.widgetReportItems) {
      if (state.state.id == reportItems.id) {
        console.log("inside service req me.widgetReportItems ",me.widgetReportItems)
        me.activeTab = reportItems;        
        me.selectedTabName = reportItems.label;
      } else if (me.id == reportItems.id) {    
        console.log("inside else service req me.widgetReportItems ",me.widgetReportItems)
        me.activeTab = reportItems;     
        me.selectedTabName = reportItems.label;       
        
        switch (me.activeTab.id) {
          case 'DBR': { // DB Request Report
            // me.dbQueriesComponent.load();
            break;
          }         
          case 'HTTP': { // HTTP Report    
            // console.log(me.selectedData);                 
            // me.httpReportComponent.load(me.selectedData);
            break;
          }
          case 'MT': {   // Method Timing
            // action
            break;
          } 
          case 'IP': { // IP Summary
            // action
            break;
          }
          case 'HOTSPOT': { // HotSpot
            // action
            break;
          }
          case 'MCD' : { // Method Call Details
            // action
            break;
          }
          case 'ATF' : { // Trx Flowmap
            // action
            break;
          }

          case 'SD' : { // Sequence Diagram
            // action
            break;
          }
          case 'EXC' : {
            me.exceptionComponent.aggregateLoad();
            break;
          }
       }
      }
    }
  }   

  searchSummaryHide() {
    const me = this;
    me.isShow = true;
  }

  openSearchPanel() {
    const me = this;
    me.isShow = false;
    me.flowPathService.load();
  }

  closeSplitView() {
    const me = this;
    me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: me.stateID } });
  }

  // private createBreadcrumbs(
  //   route: ActivatedRoute,
  //   url: string = '#',
  //   breadcrumbs: MenuItem[] = []
  // ): MenuItem[] {
  //   const me = this;
  //   const children: ActivatedRoute[] = route.children;

  //   if (children.length === 0) {
  //     return breadcrumbs;
  //   }

  //   for (const child of children) {
  //     const routeURL: string = child.snapshot.url
  //       .map((segment) => segment.path)
  //       .join('/');
  //     if (routeURL !== '') {
  //       url += `/${routeURL}`;
  //     }

  //     me.breadcrumb = [];
  //     me.breadcrumb = [
  //       { label: 'Home', routerLink: '/home/dashboard' },
  //       { label: 'Drill Down Flow Paths',
  //        command: (event: any) => {
  //         me.router.navigate(['/drilldown'], { queryParams: { state: me.stateID } });
  //       },
  //       },
  //     ];

  //     const label =
  //       child.snapshot.data[DashboardServiceReqComponent.ROUTE_DATA_BREADCRUMB];
  //     if (!isNullOrUndefined(label)) {
  //       me.breadcrumb.push({ label, url });
  //     }

  //     return this.createBreadcrumbs(child, url, me.breadcrumb);
  //   }
  // }
  load(){
    try {
      const me = this;
    me.isFromSource = me.sessionService.getSetting("ddrSource");
    me.reportID = me.sessionService.getSetting("reportID");
    if(me.isFromSource == 'widget' && me.reportID == 'DBG_BT'){
      me.dashboardServiceReqService.loadForDBG().subscribe(
        (state: Store.State) => {
          if (state instanceof DashboardServiceReqLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof DashboardServiceReqLoadedState) {
            me.isFromDBG = true;
            me.onLoaded(state);
            return;
          }
        },
        (state: DashboardServiceReqLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }
    else if(me.isFromSource == 'widget' && me.reportID == 'MT'){
      me.dashboardServiceReqService.loadForMT().subscribe(
        (state: Store.State) => {
          if (state instanceof DashboardServiceReqLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof DashboardServiceReqLoadedState) {
            me.isFromMT = true;
            me.onLoaded(state);
            return;
          }
        },
        (state: DashboardServiceReqLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }
    else{
    me.dashboardServiceReqService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof DashboardServiceReqLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DashboardServiceReqLoadedState) {
          me.isFromDBG = false;
          me.isFromMT = false;
          me.onLoaded(state);
          return;
        }
      },
      (state: DashboardServiceReqLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
    }
    } catch (e) {
      console.error(e);
    }
  }
  private onLoading(state:DashboardServiceReqLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: DashboardServiceReqLoadingErrorState) {
    const me = this;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.log(me.error);
  }

  private onLoaded(state: DashboardServiceReqLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    var strTime = me.data[0].startTime;
    var edTim= me.data[0].endTime;
    var edTim1= new Date(edTim);
    let date=("0" + edTim1.getDate()).slice(-2);
    let month = ("0" + (edTim1.getMonth()+1)).slice(-2);
    let year1 = edTim1.getFullYear().toString();
    let year = year1.substring(2,4).replace(/\+/g, ' ');
    let hours = edTim1.getHours();
    let minutes = edTim1.getMinutes();
    let seconds = edTim1.getSeconds();
    let endTimeFinal = month + "/" + date + "/" + year + " " + hours + ":" + minutes + ":" + seconds;

    var dateForDBG=new Date(me.data[0].startTime);
    var startTimeForDBG = this.datepipe.transform(dateForDBG, 'dd/MM/yy HH:MM:SS');
    //var dateForDBG1=new Date(edTim);
    var EndTimeForDBG = this.datepipe.transform(edTim1, 'dd/MM/yy HH:MM:SS');

    console.log("starttime=" + strTime + "endtime=" + endTimeFinal);

    if(me.isFromDBG === true){
      this.selectedFilter1 = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName +
    ", Instance=" + me.data[0].instanceName +  ", From=" + startTimeForDBG + ", To=" + EndTimeForDBG + ", BT=" + me.data[0].btTransaction + ", OrderBy=Query";
    }else{
      // let sourceID=me.sessionService.getSetting('source');
      // let reportId=me.sessionService.getSetting('report');
      if(me.isFromSource == 'MTfromFP' && me.reportID == 'MT_FP')
      {
        this.selectedFilter1 = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName +
        ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + endTimeFinal + ", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time"; 
      }
      else if(me.isFromMT == true){
        this.selectedFilter1 = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName +
        ", Instance=" + me.data[0].instanceName +  ", StartTime=" + startTimeForDBG + ", EndTime=" + EndTimeForDBG;
      }
      else if(me.dashboardServiceReqService.isFromDB == true)
      {
        this.selectedFilter1 = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName +
    ", Instance=" + me.data[0].instanceName +  ", From=" + startTimeForDBG + ", To=" + EndTimeForDBG +  ", OrderBy=Response Time";
      }
      else{
    this.selectedFilter1 = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName +
    ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + endTimeFinal + ", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time";
  }
}


    /*setting value of filter criteria in drilldown service */
    me.dashboardServiceReqService.filterCriteriaVal = this.selectedFilter1;
  }

  openNetForest() {
    let flowpathInstance;
    let correlationId;
    let startTimeInMs;
    let duration;
    let ndSessionId;
    let nvPageId;
    let query;

    let url = this.getHostUrl() + '/' + this.productName.toLowerCase().replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/config/NetDiagnosticsQueryTimeVariance';
    this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
      this.timeVarienceForNF = data;
      console.log("this.timeVarienceForNF = ", this.timeVarienceForNF);
    });

    if (this.selectedData.length == 0) {
      alert("No Record Selected");
      return;
    } else if (this.selectedData.length > 1) {
      alert("Please select only one flowpath.");
      return;
    } else {
        flowpathInstance = this.selectedData["flowpathInstance"];
        correlationId = this.selectedData["correlationId"];
        startTimeInMs = this.selectedData["startTimeInMs"];
        duration = this.selectedData["responseTime"];
        ndSessionId = this.selectedData["ndSessionId"];
        nvPageId = this.selectedData["nvPageId"];

      query = "fpi:" + flowpathInstance;
      console.log("duration = ", duration);
      let d1 = Number(startTimeInMs) - Number(this.timeVarianceInMs(this.timeVarienceForNF));
      let d2;

      if (duration == '< 1')
        d2 = Number(startTimeInMs) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      else
        d2 = Number(startTimeInMs) + Number(duration.replace(/,/g, '')) + Number(this.timeVarianceInMs(this.timeVarienceForNF));
      console.log("start time from FP To NF = " + d1);
      console.log("end time from FP To NF = " + d2);

      // let startTimeISO = new Date(d1).toISOString();
      // let endTimeISO = new Date(d2).toISOString();

      let startTimeISO = d1;
      let endTimeISO = d2;

      console.log("startTimeISO = ", startTimeISO, ", endTimeISO = ", endTimeISO);

      if (correlationId != "" && correlationId != "-")
        query += "%20AND%20corrid:" + correlationId;

      if (nvPageId != "" && nvPageId != "-")
        query += "%20AND%20pageid:" + nvPageId;

      if (ndSessionId != "" && ndSessionId != "-")
        query += "%20AND%20ndsessionid:" + ndSessionId;

      query = "( " + query + " )";

      query = query.replaceAll("%20"," ");
      this.router.navigate(["/home/logs"], { queryParams: { queryStr: query,  startTime : startTimeISO , endTime : endTimeISO}});

    }
  }

  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  timeVarianceInMs(time) {
    var timeVarianceInMs = time;
    var timeVarNum = "";

    if (/^[0-9]*h$/.test(time)) //If time is in hour formate- xh eg:2h means 2 hour variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 60 * 1000;
    }
    else if (/^[0-9]*m$/.test(time)) //If time is in minute formate- xm eg:20m means 20 minute variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 60 * 1000;
    }
    else if (/^[0-9]*s$/.test(time)) //If time is in second formate- xs eg:200s means 200 second variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 1);
      timeVarianceInMs = Number(timeVarNum) * 1000;
    }
    else if (/^[0-9]*ms$/.test(time)) //If time is in millisecond formate- xs eg:200ms means 200 millisecond variance is appliend in configuration file
    {
      timeVarNum = time.substring(0, time.length - 2);
      timeVarianceInMs = Number(timeVarNum);
    }
    else if (/^[0-9]*$/.test(time)) // if there is only number, it is considered as seconds 
    {
      timeVarianceInMs = Number(time) * 1000;
    }
    else {
      alert("Please provide value of 'NetDiagnosticsQueryTimeVariance' in proper format in config.ini i.e.- Nh or Nm or Ns or Nms or N where N is a integer ");
      return Number(900000); //if value of ndQueryTimeVariance is not in desired format then NF report will open with default variance time that is 15 minutes(900000ms).

    }
    return Number(timeVarianceInMs);
  }

  openNVFromND() {
    let url1 = this.getHostUrl() + '/' + this.productName.toLowerCase().replace("/", "") + '/v1/cavisson/netdiagnostics/ddr/config/NetVisionUrl';
    this.ddrRequest.getDataInStringUsingGet(url1).subscribe(data => {
      this.NVUrl = data;
    })
    if(sessionStorage.getItem("isMultiDCMode") != "true") {
    if (this.NVUrl != 'NA') {
      if (this.selectedData.length == 0) {
        alert("No Flowpath is Selected");
        return;
      }
      else if (this.selectedData.length > 1) {
        alert("Select Only One Flowpath at a time");
        return;
      }
      else {
        let nvSessionId = 'NA';
        let nvPageId = 'NA';
        let urlForNV;

        if (this.selectedData) {
          if (this.selectedData['nvSessionId'] != '-' && this.selectedData['nvSessionId'] != '' && this.selectedData['nvSessionId'] != "0")
            nvSessionId = this.selectedData['nvSessionId'];
          else{
            alert('NV Session Id is not Available or' + this.selectedData['nvSessionId']);
            return;
         }  

          if (this.selectedData['nvPageId'] != '-' && this.selectedData['nvPageId'] != '')
            nvPageId = this.selectedData['nvPageId'];
  
        this.router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });  
      }
    }
    }

  }
  else {

        let nvSessionId = 'NA';
        let nvPageId = 'NA';

        if (this.selectedData.length == 0) {
          alert("No Flowpath is Selected");
          return;
        }
        else if (this.selectedData.length > 1) {
          alert("Select Only One Flowpath at a time");
          return;
        }

        if (this.selectedData) {
          if (this.selectedData['nvSessionId'] != '-' && this.selectedData['nvSessionId'] != '' && this.selectedData['nvSessionId'] != "0"){
            nvSessionId = this.selectedData['nvSessionId'];
          }
          else{
            alert('NV Session Id is not Available for ' + this.selectedData['nvSessionId']);
            return;
          }  

          if (this.selectedData['nvPageId'] != '-' && this.selectedData['nvPageId'] != '' && this.selectedData['nvPageId'] != "0")
            nvPageId = this.selectedData['nvPageId'];
       
        sessionStorage.removeItem('__nvSessionData');
        this.router.navigate(['/sessions-details'], { queryParams: { sid: nvSessionId } });
   }
  }
  }

  openED(){
    const me = this;
    me.router.navigate(['/exec-dashboard/main/tierStatus']); 
  }

}
