import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { MenuItem, SelectItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { DrilldownService } from 'src/app/pages/drilldown/service/drilldown.service';
import { DDRRequestService } from 'src/app/pages/tools/actions/dumps/service/ddr-request.service';
import { WidgetDrillDownMenuItem } from '../dashboard/widget/widget-menu/service/widget-menu.model';
import { PageSidebarComponent } from '../page-sidebar/page-sidebar.component';
import { TimebarValue, TimebarValueInput, TimeMarker } from '../time-bar/service/time-bar.model';
import { TimebarService } from '../time-bar/service/time-bar.service';
import { GlobalTimebarAlertLoadedState } from '../time-bar/service/time-bar.state';
import { MenuItemUtility } from '../utility/menu-item';
import { ObjectUtility } from '../utility/object';
import { GlobalDrillDownFilterData } from './service/global-drilldown-filter.model';
import { GlobalDrillDownFilterService } from './service/global-drilldown-filter.service';
import { GlobalDrillDownFilterLoadingState, GlobalDrillDownFilterLoadedState, GlobalDrillDownFilterLoadingErrorState } from './service/global-drilldown-filter.state';

@Component({
  selector: 'app-global-drilldown-filter',
  templateUrl: './global-drilldown-filter.component.html',
  styleUrls: ['./global-drilldown-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GlobalDrilldownFilterComponent extends PageSidebarComponent
  implements OnInit {

  activeState: boolean[] = [true, false, false];
  classes = 'page-sidebar';

  bTransaction;
  drillDownType = [];
  timesDropDown = [];
  isOpen = false;
  selectedItem: string;

  items: MenuItem[];
  data: GlobalDrillDownFilterData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  selectedReport: any;
  selectedFilter: any; //For filter criteria 


  /* Variables using for Cqm in LRm */

  selectedData: any;

  //Time filter
  timeFilter: boolean;
  standardTime: SelectItem[];
  selectedTime: any;
  strDate: Date;
  endDate: Date;
  strTime: string;
  endTime: string;
  strTimeInDateFormat: string;
  showStartTimeError: boolean = false;
  showEndTimeError: boolean = false;
  startDateObj = new Date();
  endDateObj = new Date();
  endTimeInDateFormat: string;
  strTimeFilterCriteria: string;
  endTimeFilterCriteria: string;


  // Tier Variables
  selectedTier: boolean;  //whether tier chechbox is checked or not
  tierName: any = [];
  tierList: SelectItem[];
  tierMetaData: any;
  tierId: any = [];

  //server varibales
  selectedServer: boolean; //whether server checkbox is checked or not
  serverName: any = [];
  serverList: SelectItem[];
  serverMetaData: any;
  serverId: any = [];

  //app variables 
  selectedApp: boolean; //whether app checkox is selected or not
  appName: any = [];
  appList: SelectItem[];
  appMetaData: any;
  appId: any = [];

  //FlowpathInstance Variables 
  selectedFp: boolean;
  fpInstance: string = "";

  //Buisness Transaction Variables
  checkedBuisnessTransaction: boolean = false;
  BTOptions: SelectItem[] = [];
  selectedBuisnessTransaction: any;

  //BT Cateogry Varaibles
  BTCategory: SelectItem[] = [{ label: 'Normal', value: 10 }, { label: 'Slow', value: 11 }, { label: 'Very Slow', value: 12 }, { label: 'Errors', value: 13 }];
  selectedBTCategory: string;
  selectedBT: boolean;

  //Response Time Variables
  checkedResponseTime: boolean;
  resCompareOptions: SelectItem[] = [{ label: '<=', value: '1' }, { label: '>=', value: '2' }, { label: '=', value: '3' }];
  resSelectedCompareOption: string = '1';
  responseTime: any;
  responseTime1: any;
  responseTime2: any;
  resVariance: any;
  showingEqualResponseBox: boolean = false;
  responseTimeMessage: boolean = false;

  //Method Count Variables
  checkedMethodCount: boolean;
  minMethods: string;

  //CorrelationId Varibles
  checkedCorrId: boolean;
  corrId: string;
  corrIdModeOptions: SelectItem[] = [{ label: 'Exact', value: 1 }, { label: 'StartsWith', value: 2 }, { label: 'EndsWith', value: 3 }, { label: 'Contains', value: 4 }];
  selectedCorrIdMode: string;

  //fp order by 
  fpOrderByOptions: SelectItem[] = [{ label: 'Total Response Time', value: 'fpduration_desc' }, { label: 'Callout Errors', value: 'error_callout' }, { label: 'Cpu Time', value: 'btcputime_desc' }]
  fpOrderByCheck: boolean = false;
  selectedFpOrderBy: any;

  // pie chart filter for MT
  checkNEntityforPie: boolean;
  selectedTopNEntity: string;

  // pie chart filter for DB
  checkNQueryforPie: boolean;
  selectedTopNQuery: string;

  //db order by
  dbOrderByOptions: SelectItem[] = [{ label: 'Response Time', value: 'exec_time_desc' }, { label: 'Count', value: 'count_desc' }, { label: 'Error Count', value: 'query_count' }]
  dbOrderByCheck: boolean = false;
  selectedDbOrderBy: any;

  //Groupby and order by
  checkGroup: boolean;
  checkOrder: boolean;
  selectedGroupBy: string[] = [];
  groupBy: SelectItem[] = [];
  orderBy: SelectItem[] = [];
  selectedOrderBy: string[] = [];

  //DL and req/resp flag
  checkReqRespFlag:boolean=false;
  checkDLFlag:boolean=false;

  productName: string;

  constructor(
    private timebarService: TimebarService,
    public globalDrillDownFilterService: GlobalDrillDownFilterService,
    private sessionService: SessionService,
    private router: Router,
    private ddrRequest: DDRRequestService,
    private drilldownService: DrilldownService
  ) {
    super();

  }

  ngAfterViewInit() {
  }


  ngOnInit(): void {
    const me = this;
    me.productName = this.sessionService.session.cctx.prodType; // product name. 
    me.load();
  }

  onClickMenu(item) {
    this.selectedItem = item.toElement.innerText
  }

  load() {
    const me = this;
    me.globalDrillDownFilterService.load().subscribe(
      (state: Store.State) => {

        if (state instanceof GlobalDrillDownFilterLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof GlobalDrillDownFilterLoadedState) {
          me.onLoaded(state);
          return;
        }

      },
      (state: GlobalDrillDownFilterLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: GlobalDrillDownFilterLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: GlobalDrillDownFilterLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: GlobalDrillDownFilterLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
  }


  specifiedTypeChanged() { }

  specifiedTimerChanged($event) {
  }

  changeReport() { }

  drillDownFilterApply() {
    if (this.selectedTime && this.timeFilter) {
      this.setTimeFilter();
    }
    else {
      this.drillDownFilter();
    }
  }

  drillDownFilter() {
    const me = this;
    var filterCriteria = {};
    if(this.drilldownService.filterCriteriaObj) {
	filterCriteria = this.drilldownService.filterCriteriaObj;
    }
    super.hide();
    //if (this.selectedTime) {
    //  this.setTimeFilter();
    //}
    this.selectedData = {};
    if (this.tierName && this.tierName.length != 0) {
      this.selectedData['tierName'] = this.tierName;
      this.getTierId();
      this.selectedData['tierId'] = this.tierId.toString();
      filterCriteria["Tier"] = this.tierName;
    }
    if (this.serverName && this.serverName.length != 0) {
      this.selectedData['serverName'] = this.serverName;
      this.getServerId();
      this.selectedData['serverId'] = this.serverId.toString();
      filterCriteria["Server"] = this.serverName;
    }
    if (this.appName && this.appName.length != 0) {
      this.selectedData['appName'] = this.appName;
      this.getappId();
      this.selectedData['appId'] = this.appId.toString();
      filterCriteria["Instance"] = this.appName;
    }
    if (this.fpInstance) {
      this.selectedData['flowpathID'] = this.fpInstance;
    }
    if (this.selectedBTCategory) {
      this.selectedData['selectedBTCategory'] = this.selectedBTCategory;
    }
    if (this.minMethods) {
      this.selectedData['minMethods'] = this.minMethods;
    }
    if (this.corrId && this.selectedCorrIdMode && this.checkedCorrId == true) {
      this.selectedData['correlationId'] = this.corrId;
      this.selectedData['corModeValue'] = this.selectedCorrIdMode.toString();
    }
    if (this.selectedFpOrderBy && this.selectedFpOrderBy != [] && this.selectedFpOrderBy.length!= 0) {
      this.selectedData["strOrderBy"] = this.selectedFpOrderBy;
    }

    if (this.selectedBuisnessTransaction != undefined && this.selectedBuisnessTransaction.length !=0) {
      this.selectedData["urlName"] = this.selectedBuisnessTransaction.name;
      this.selectedData["urlIndex"] = this.selectedBuisnessTransaction.id;
      filterCriteria["BT"] = this.selectedBuisnessTransaction.name;
    }

    if (this.selectedTopNEntity && this.selectedTopNEntity != null) {
      this.selectedData["topNEntities"] = this.selectedTopNEntity;
    }

    if (this.selectedDbOrderBy && this.selectedDbOrderBy != [] && this.selectedDbOrderBy.length!=0) {
      this.selectedData["strOrderBy"] = this.selectedDbOrderBy;
    }

    if (this.selectedGroupBy.length == 0) {
      if(this.globalDrillDownFilterService.currentReport != "Flowpath") {
        this.selectedData["strGroup"] = 'url';
      }
    }
    else {
      this.selectedData["strGroup"] = this.selectedGroupBy;
    }

    if (this.selectedOrderBy.length == 0 && this.globalDrillDownFilterService.currentReport != "FPG_BT") {
      if(this.globalDrillDownFilterService.currentReport != "Flowpath") {
        this.selectedData["strOrderBy"] = 'count_desc';
      }
    }
    else {
      this.selectedData["strOrderBy"] = this.selectedOrderBy;
    }

    if (this.strTime !== null && this.strTime !== undefined) {
      this.selectedData["strStartTime"] = this.strTime;
      //filterCriteria["StartTime"] = this.strTime;
      filterCriteria["StartTime"] = this.strTimeFilterCriteria;
    }
    if (this.endTime !== null && this.endTime !== undefined) {
      this.selectedData["strEndTime"] = this.endTime;
      //filterCriteria["EndTime"] = this.endTime;
      filterCriteria["EndTime"] = this.endTimeFilterCriteria;
    }

    if(this.checkDLFlag!= null &&this.checkDLFlag!= undefined && this.checkDLFlag){
      this.selectedData["checkDLFlag"] = this.checkDLFlag;;
    }
    if(this.checkReqRespFlag!= null &&this.checkReqRespFlag!= undefined && this.checkReqRespFlag){
      this.selectedData["checkReqRespFlag"] = this.checkReqRespFlag;
    }
    console.log("The value inside the selectedData is ....", this.selectedData);
    this.selectedFilter = "Tier=" + filterCriteria["Tier"] + ", Server=" + filterCriteria["Server"] +
      ", Instance=" + filterCriteria["Instance"] + ", StartTime=" + filterCriteria["StartTime"] + ", EndTime=" + filterCriteria["EndTime"] + ", BT=" + filterCriteria["BT"] + ", OrderBy=Total Response Time";
    console.log("The value inside the selectedFilter is ......", this.selectedFilter);
    /*setting value of filter criteria in drilldown service */
    me.drilldownService.selectedFilter = this.selectedFilter;
    me.drilldownService.filterCriteriaVal = this.selectedFilter;
    switch (me.globalDrillDownFilterService.currentReport) {
      case 'Flowpath': {
        //this.router.navigate(['/drilldown/flow-path']);
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;
      }
      case 'Exception': {
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;
      }
      case 'Method Timing': {
        //this.router.navigate(['/dashboard-service-req/method-timing']);
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;

      }

      case 'DB Report': {
        //this.router.navigate(['/dashboard-service-req/db-queries']);
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;
      }

      case 'Hotspot': {
        //this.router.navigate(['/dashboard-service-req/hotspot']);
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;
      }

      case 'FPG_BT': {
        console.log("Inside the switch case of Flowpath Groupby");
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;
      }

      case 'DBG_BT': {
        //me.router.navigate(['/drilldown/db-group-by']);
        console.log("Inside the switch case of DB Groupby");
        this.globalDrillDownFilterService.sideBarUI$.next(this.selectedData);
        break;
      }
    }
  }

  getTierId() {
    console.log("The value inside the selected tiername inside the tierId is ..", this.tierName);
    this.tierId = [];
    for (let i = 0; i < this.tierName.length; i++) {
      let tierid = this.tierMetaData[this.tierName[i]];
      if (this.tierId.indexOf(tierid) == -1)  //for unique ids
        this.tierId.push(tierid);
    }
    console.log("the value inside the tierId of selectedTier is .........", this.tierId);
  }

  tierInfo() {
    if (this.selectedTier) {
      console.log("The value inside the selected tier is ....", this.selectedTier);
      this.sessionService.setSetting("metaDataType", "tier");
      this.globalDrillDownFilterService.interceptor.loadSomeRest().subscribe((data) => {
        this.tierMetaData = data;
        console.log("The value from the promise is ........", this.tierMetaData, "****", data);
        this.tierData(data);
      });
    }
    else {
      this.setDefaultTierServerAppFilter();
    }

  }

  tierData(res: any) {
    this.tierList = [];
    console.log("The value inside the res is.....", res);
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let id = res[keys[i]];    //tierId
      let tName = keys[i];     //tierName
      this.tierList.push({ label: tName, value: tName });
      console.log("The value inside the tierList is ......", this.tierList);
    }
  }

  serverInfo() {
    if (this.selectedServer) {
      console.log("The value inside the selected server is ....", this.selectedServer);
      this.sessionService.setSetting("metaDataType", "server");
      this.globalDrillDownFilterService.interceptor.loadSomeRest().subscribe((data) => {
        this.serverMetaData = data;
        console.log("The value from the promise is ........", this.serverMetaData, "****", data);
        this.serverData(data);
      });
    }
    else {
      this.setDefaultServerAppFilter();
    }
  }

  appInfo() {
    if (this.selectedApp) {
      console.log("The value inside the selected server is ....", this.selectedApp);
      this.sessionService.setSetting("metaDataType", "app");
      this.globalDrillDownFilterService.interceptor.loadSomeRest().subscribe((data) => {
        this.appMetaData = data;
        console.log("The value from the promise is ........", this.appMetaData, "****", data);
        this.appData(data);
      });
    }
    else {
      this.appName = [];
      this.appId = [];
    }

  }

  appData(res: any) {
    console.log(" method - appData and appMataData =  =", res);
    this.appMetaData = res;
    this.appList = [];
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {
      let tsaName = keys[i];  //tierName:serverName:appName
      let tsaNameArr = tsaName.split(':');
      let tsName = tsaNameArr[0] + ":" + tsaNameArr[1];
      let tName = tsaNameArr[0];

      if (this.serverName.indexOf(tsName) > -1)  //show instances of only selected servres
      {
        this.appList.push({ label: tsaName, value: tsaName });
      }
      else if (this.serverName.length == 0 && this.tierName.indexOf(tName) > -1) //when no server is selected then show instances of selected Tier
      {
        this.appList.push({ label: tsaName, value: tsaName });
      }
      else if (this.serverName.length == 0 && this.tierName.length == 0)  //if no tier, no server is selected, show all instances 
      {
        this.appList.push({ label: tsaName, value: tsaName });
      }
    }
    /*if(this.tierName.length ==  1)
    {
      if(this.tierName[0] ==  this.message.tierName)
      var appArr  = [];
      appArr.push(this.message.tierName+":"+this.message.serverName+":"+this.message.appName);
        this.appName = appArr;
    }*/
    console.log(' method - appData and applist ===', this.appList);
  }

  appFilter() {

  }

  getappId() {
    if (this.appName.length != 0) {
      // if (this.appName.toString().indexOf('Overall') != -1) {
      //   this.appNameFC = "NA";
      //   this.appId = ["NA"];
      // }
      // else  //getID
      // {
      this.appId = [];
      for (let i = 0; i < this.appName.length; i++) {
        let appid = this.appMetaData[this.appName[i]];
        if (this.appId.indexOf(appid) == -1)
          this.appId.push(appid);

        // let appNameArr = this.appName[i].split(":");

        // if (i == 0)
        //   this.appNameFC = appNameArr[2];
        // else if (this.appNameFC.indexOf(appNameArr[2]) == -1)
        //   this.appNameFC += "," + appNameArr[2];
      }
      // }
    }
  }



  serverData(res: any) {
    console.log("method - serverData and serverMataData =", res)
    this.serverMetaData = res;
    this.serverList = [];
    let keys = Object.keys(res);

    //this.serverList.push({ label: 'Overall', value: 'Overall' });
    for (let i = 0; i < keys.length; i++) {
      let id = res[keys[i]];   // serverId
      let tsName = keys[i];    //  tierName:serverName i.e - Tier29:AppServer29
      let tierServerName = tsName.split(":");  //index  0- tierName, 1- serverName

      //this.serverIdNameObj[id] =tierServerName[1];
      if (this.tierName.indexOf(tierServerName[0]) > -1)    //serverNames of only selected tiers 
      {
        this.serverList.push({ label: tsName, value: tsName });
      }
      else if (this.tierName.length == 0)  //when no tier is selected , show all servers 
      {
        this.serverList.push({ label: tsName, value: tsName });
      }
    }

    console.log('method - serverData and serverlist====', this.serverList);
  }

  getServerId() {
    if (this.serverName.length != 0) {
      // if (this.serverName.indexOf('Overall') != -1)   //if tier Overall selected
      // {
      //   this.serverNameFC = "NA";
      //   this.serverId = ["NA"];
      // }
      // else {
      this.serverId = [];
      for (let i = 0; i < this.serverName.length; i++) {
        let serverid = this.serverMetaData[this.serverName[i]];
        if (this.serverId.indexOf(serverid) == -1)
          this.serverId.push(serverid);

        // let serverNameArr = this.serverName[i].split(":");
        // if (i == 0)
        //   this.serverNameFC = serverNameArr[1];
        // else if (this.serverNameFC.indexOf(serverNameArr[1]) == -1)
        //   this.serverNameFC += "," + serverNameArr[1];

      }
      // }
    }
  }

  setDefaultTierServerAppFilter() {
    this.tierName = [];
    this.tierId = [];
    this.setDefaultServerAppFilter();
  }

  setDefaultServerAppFilter() {
    this.serverList = [];
    this.serverName = [];
    this.serverId = [];
    this.selectedServer = false;

    this.appList = [];

    this.appName = [];
    this.appId = [];
    this.selectedApp = false; //uncheck   app checkbox
    this.tierId = [];
  }

  fpInstanceInfo() {
    if (this.selectedFp == false) {
      this.selectedData.fpInstance = "";
      this.fpInstance = "";
    }
    //else
    // this.fpInstance = this.commonServices.flowpathInstance; 
  }
  onlyNumberKeyAndComma(event) {
    if (this.fpInstance.slice(-1) == "," && event.charCode == 44) {
      return false;
    }
    else {
      return (event.charCode == 8 || event.charCode == 0) ? null : (event.charCode >= 48 && event.charCode <= 57) || event.charCode == 44;
    }
  }

  btInfo() {
    if (this.checkedBuisnessTransaction) {
      this.sessionService.setSetting("metaDataType", "businessTransaction");
      this.globalDrillDownFilterService.interceptor.loadSomeRest().subscribe((data) => {
        this.btData(data);
      });
    }
    else {
      this.selectedBuisnessTransaction = "";
    }
  }

  btData(res: any) {

    this.BTOptions = [];
    let keys = Object.keys(res);
    for (let i = 0; i < keys.length; i++) {

      //  if(this.message.urlName != undefined && this.message.urlName == keys[i])
      //   this.message.urlIndex = res[keys[i]] ;
      this.BTOptions.push({ label: keys[i], value: { id: res[keys[i]], name: keys[i] } });
    }

  }



  btcheck() {
    if (this.selectedBT == false) {
      this.selectedBTCategory = "";
    }
  }

  dbOrderBy() {
    if (this.dbOrderByCheck == false)
      this.selectedDbOrderBy = [];
  }

  getGroupBy() {
    this.groupBy = [];
    this.groupBy.push({ label: 'BT', value: 'url' });
    //this.groupBy.push({ label: 'FlowPath Signature', value: 'flowpathsignature' });
    this.groupBy.push({ label: 'Tier', value: 'tier' });
    this.groupBy.push({ label: 'Server', value: 'server' });
    this.groupBy.push({ label: 'Instance', value: 'app' });

    if (this.globalDrillDownFilterService.currentReport != "Exception")
      this.groupBy.push({ label: 'BT Category', value: 'btcategory' });
    if (this.checkGroup == false) {
      this.selectedGroupBy = [];
      this.selectedOrderBy = []; // because when we disable groupby , the orderby options should not contains the groupby options
      this.checkOrder = false;
    }
  }

  getOrderBy() {
    this.orderBy = [];
    this.selectedOrderBy = [];
    this.checkOrder == false;
    console.log("this.selectedGroupBy list ---", this.selectedGroupBy);

    if (this.globalDrillDownFilterService.currentReport == "Flowpath") {
      this.orderBy.push({ label: 'Average FP Duration ASC', value: 'avgfpduration' });
      this.orderBy.push({ label: 'Average FP Duration DESC', value: 'avgfpduration_desc' });
    }

    console.log("selected group by===>", this.selectedGroupBy);
    if (this.selectedGroupBy.length != 0) {
      this.checkOrder == true;
      for (let i = 0; i < this.selectedGroupBy.length; i++) {
        if (this.selectedGroupBy[i] == 'url')
          this.orderBy.push({ label: 'BT', value: 'url' });
        else if (this.selectedGroupBy[i] == 'tier')
          this.orderBy.push({ label: 'Tier', value: 'tier' });
        else if (this.selectedGroupBy[i] == 'server')
          this.orderBy.push({ label: 'Server', value: 'server' });
        else if (this.selectedGroupBy[i] == 'app')
          this.orderBy.push({ label: 'Instance', value: 'app' });
        else if (this.selectedGroupBy[i] == 'btcategory')
          this.orderBy.push({ label: 'BT Category', value: 'btcategory' });
      }
    }
    if (this.checkOrder == false) {
      this.selectedOrderBy == [];
    }
  }

  enableOrderBy() {
    if (this.checkGroup == true && this.selectedGroupBy.length > 0)
      return false;
  }

  showGroupBy(): any {
    if (this.globalDrillDownFilterService.currentReport == 'FPG_BT' || this.globalDrillDownFilterService.currentReport == 'DBG_BT')
      return true;
    else
      return false;
  }

  timeOptions() {
    this.createDropDownMenu();
    if (this.timeFilter == false) {
      this.selectedTime = "240";
      this.standardTime = [];
    }
  }

  createDropDownMenu() {
    this.standardTime = [];
    this.standardTime.push({ label: 'Last 10 minutes', value: '10' });
    this.standardTime.push({ label: 'Last 30 minutes', value: '30' });
    this.standardTime.push({ label: 'Last 1 hour', value: '60' });
    this.standardTime.push({ label: 'Last 2 hours', value: '120' });
    this.standardTime.push({ label: 'Last 4 hours', value: '240' });
    this.standardTime.push({ label: 'Last 8 hours', value: '480' });
    this.standardTime.push({ label: 'Last 12 hours', value: '720' });
    this.standardTime.push({ label: 'Last 24 hours', value: '1440' });
    this.standardTime.push({ label: 'Custom Time', value: 'Custom Time' });
  }

  getPhaseOptions() {
    if (this.selectedTime == 'Specified Phase') {
      // need to support for NS filters
    }
  }

  onStrDate(event) {
    console.log("In this function");
    if (event && event['inputType'] == "insertText") {
      if (this.strDate == new Date("1/1/1970 5:30:0"))
        this.showStartTimeError = true;
      else
        this.showStartTimeError = false;
      event = this.strDate;
    }
    else
      this.showStartTimeError = false;
    let date = new Date(event);
    this.startDateObj = date;
    this.strTimeInDateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log("onStrDate(event) ", this.strTime, this.strDate, this.strTimeInDateFormat);
  }

  onEndDate(event) {
    if (event && event['inputType'] == "insertText") {
      if (this.endDate == new Date("1/1/1970 5:30:0"))
        this.showEndTimeError = true;
      else
        this.showEndTimeError = false;
      event = this.endDate;
    }
    else
      this.showEndTimeError = false;
    let date = new Date(event);
    this.endDateObj = date;
    this.endTimeInDateFormat = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log("onEndDate(event)", this.endTime, this.endDate, this.endTimeInDateFormat);
  }

  setTimeFilter() {
    if (this.selectedTime == 'Custom Time') {
      if (!this.strDate) {
        alert("Please Provide Start Time");
      }
      if (!this.endDate) {
        alert("Please Provide End Time");
      }
      if (this.globalDrillDownFilterService.isValidParameter(this.strTimeInDateFormat) && this.globalDrillDownFilterService.isValidParameter(this.endTimeInDateFormat)) {
        this.strTimeFilterCriteria = this.strTimeInDateFormat;
        this.endTimeFilterCriteria = this.endTimeInDateFormat;
        let url = '';
        url = this.getHostUrl() + '/' + this.productName.toLowerCase() + '/v1/cavisson/netdiagnostics/ddr/timeHandling?testRun=' + this.sessionService.testRun.id + '&startTimeInDateFormat=' + this.strTimeInDateFormat + '&endTimeInDateFormat=' + this.endTimeInDateFormat;
        this.ddrRequest.getDataUsingGet(url).subscribe(data => {
          this.assignCustomTime(data);
          this.drillDownFilter();
        });
      }
    }
    else if (this.globalDrillDownFilterService.isValidParameter(this.selectedTime)) {
      let timeFilterUrl = '';
      timeFilterUrl = this.getHostUrl() + '/' + this.productName.toLowerCase() + '/v1/cavisson/netdiagnostics/ddr/getTimeStamp?testRun=' + this.sessionService.testRun.id
      timeFilterUrl = timeFilterUrl + "&graphTimeKey=" + this.selectedTime;
      this.ddrRequest.getDataUsingGet(timeFilterUrl).subscribe(data => {
        this.assignStandardTime(data);
        this.drillDownFilter();
      });
    }
  }

  assignCustomTime(res: any) {
    console.log("res data for custom time--", res);
    this.strTime = res.strStartTime;
    this.endTime = res.strEndTime;
  }

  getHostUrl(isDownloadCase?): string {
    var hostDcName = window.location.protocol + '//' + window.location.host;
    // console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  assignStandardTime(res: any) {
    console.log("set time filter is ", res);
    this.strTime = res.ddrStartTime;
    this.endTime = res.ddrEndTime;
    this.strTimeFilterCriteria = res.ddrStartTimeInDateFormat;
    this.endTimeFilterCriteria = res.ddrEndTimeInDateFormat;
    this.strDate = null;
    this.endDate = null;
  }

  responseCheck() {
    if (this.checkedResponseTime == false) {
      this.showingEqualResponseBox = false;
      this.resSelectedCompareOption = "1";
      this.responseTime = "";
      this.resVariance = "";
    }
  }

  responseEqualCase() {
    if (this.resSelectedCompareOption == "3")
      this.showingEqualResponseBox = true;
    else {
      this.showingEqualResponseBox = false;
      this.resVariance = "";
    }
  }


  setDefaultAppFilter() {

  }

  checkTopNEntity() {
    if (this.checkNEntityforPie == false)
      this.selectedTopNEntity = '';
  }

  checkTopNQuery() {
    if (this.checkNQueryforPie == false)
      this.selectedTopNQuery = '';
  }

  methodCheck() {
    if (this.checkedMethodCount == false)
      this.minMethods = "";
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  corelationcheck() {
    if (this.checkedCorrId == false) {
      this.selectedCorrIdMode = "";
      this.corrId = "";
    }
  }

  fpOrderCheck() {
    if (this.fpOrderByCheck == false)
      this.selectedFpOrderBy = [];
  }

  DLCheck(){
    console.log("i am in DL change");
  }
  ReqRespCheck(){
    console.log("i am in Request response change");
  }

  drillDownFilterReset() {
    this.timeFilter = false;
    this.selectedTime = '';
    this.checkGroup = false;
    this.selectedGroupBy = [];
    this.checkOrder = false;
    this.selectedOrderBy = [];
    this.selectedTier = false;
    this.setDefaultTierServerAppFilter();
    this.selectedServer = false;
    this.setDefaultServerAppFilter();
    this.selectedApp = false;
    this.appName = [];
    this.appId = [];
    this.selectedFp = false;
    this.fpInstance = "";
    this.checkedBuisnessTransaction = false;
    this.selectedBuisnessTransaction = "";
    this.selectedBT = false;
    this.selectedBTCategory = "";
    this.checkNQueryforPie = false;
    this.selectedTopNQuery = '';
    this.dbOrderByCheck = false;
    this.selectedDbOrderBy = [];
    this.tierMetaData = undefined;
    this.serverMetaData = undefined;
    this.appMetaData = undefined;
    this.checkedBuisnessTransaction = false;
    this.BTOptions = [];
    this.selectedBuisnessTransaction = [];
    this.checkedCorrId = false;
    this.selectedCorrIdMode = "";
    this.corrId = "";
    this.fpOrderByCheck = false;
    this.selectedFpOrderBy = [];
    this.checkedMethodCount = false;
    this.minMethods = "";
    this.checkNEntityforPie = false;
    this.selectedTopNEntity = '';
    this.checkedResponseTime = false;
    this.responseCheck();
    this.checkDLFlag = false;
    this.checkReqRespFlag = false;
  }


  closeClick() {
    const me = this;
    super.hide();
  }

  // onTabClose(event) {
  // }

  // onTabOpen(event) {
  // }

  // toggle(index: number) {
  //   this.activeState[index] = !this.activeState[index];
  // }


}
