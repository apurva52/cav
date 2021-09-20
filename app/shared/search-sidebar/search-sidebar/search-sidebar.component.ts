import { Component, Injectable, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TierStatusCommonDataHandlerService } from 'src/app/pages/exec-dashboard/components/exec-dashboard-tier-status/services/tier-status-common-data-handler.service';
import { TierStatusDataHandlerService } from 'src/app/pages/exec-dashboard/components/exec-dashboard-tier-status/services/tier-status-data-handler.service';
import { TierStatusMenuHandlerService } from 'src/app/pages/exec-dashboard/components/exec-dashboard-tier-status/services/tier-status-menu-handler.service';
import { TierStatusTimeHandlerService } from 'src/app/pages/exec-dashboard/components/exec-dashboard-tier-status/services/tier-status-time-handler.service';
import { customData, ImmutableArray } from 'src/app/pages/exec-dashboard/components/store-health-status/store-health-status.component';
import { ExecDashboardCommonRequestHandler } from 'src/app/pages/exec-dashboard/services/exec-dashboard-common-request-handler.service';
import { CustomSelectItem, ExecDashboardConfigService } from 'src/app/pages/exec-dashboard/services/exec-dashboard-config.service';
import { ExecDashboardDataContainerService } from 'src/app/pages/exec-dashboard/services/exec-dashboard-data-container.service';
import { ExecDashboardUtil } from 'src/app/pages/exec-dashboard/utils/exec-dashboard-util';
import { GeolocationService } from 'src/app/pages/geolocation/service/geolocation.service';
import { DdrDataModelService } from 'src/app/pages/tools/actions/dumps/service/ddr-data-model.service';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { SearchSidebarData, SearchSidebarLoadPayload, SearchSidebarTableHeaderCols } from './service/search-sidebar.model';
import { SearchSidebarService } from './service/search-sidebar.service';
import { SearchSidebarLoadingState, SearchSidebarLoadedState, SearchSidebarLoadingErrorState } from './service/search-sidebar.state';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ TierStatusDataHandlerService,ExecDashboardDataContainerService,ExecDashboardConfigService,ExecDashboardCommonRequestHandler,ExecDashboardUtil,TierStatusTimeHandlerService,TierStatusCommonDataHandlerService,TierStatusMenuHandlerService]
})
export class SearchSidebarComponent extends PageSidebarComponent
  implements OnInit {

  classes = 'page-sidebar search-sidebar';
  selectedData: any;
  data: SearchSidebarData;
  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  storeViewDataOpt:SelectItem[] = [];
  cols: SearchSidebarTableHeaderCols[] = [];
  _selectedColumns: SearchSidebarTableHeaderCols[] = [];

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  items: MenuItem[];
  standardTier:any[];
  standardMode:string;
  standardCorrelationId:any[];
  selectedtierList: any = [];
  standardFlowpathId:any;
  stndVal:any;
  customTier:any=[];
  customName:string;
  customOperation:string;
  logsTier:string;
  logsCorrelationId:any;
  logsFlowpath:any;
  widgetReportItems: MenuItem[];
  correlationID: any[];
  flowpathID: any = "";
  mode: string;
    //Variables for Custom
    selectedtierListForCustom: any = [];
    customNameList: CustomSelectItem[] = [];
    customRulesData: customData[];
    //Variables  for Logs
  pattern: any;
  flowpathIDForLogs: any;
  correlationIDForLogs: any;
  selectedtierListForLogs: any = [];
  customDetail: customData;

  constructor(
    private searchSidebarService: SearchSidebarService,
    private geolocationService: GeolocationService,
    private _dataHandlerService: TierStatusDataHandlerService,
    private _ddrData:DdrDataModelService,
    private _cavConfig: CavConfigService,
    private _dataContainer : ExecDashboardDataContainerService,
   private _TierStatusMenuHandlerService :TierStatusMenuHandlerService,
   public _config: ExecDashboardConfigService,
  ) {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.load(null);
    me.checkStoreListData();
    
}

  load(payload: SearchSidebarLoadPayload) {
    const me = this;
    me.searchSidebarService.load(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof SearchSidebarLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof SearchSidebarLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: SearchSidebarLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );


  }

  private onLoading(state: SearchSidebarLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: SearchSidebarLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
    me.empty = false;
  }

  private onLoaded(state: SearchSidebarLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    me.empty = false;

    if (me.data) {
      //me.data.treeTable.data == null;
      me.empty = false;
      if (!me.data.tableData.data && me.data.tableData.data == null) {
        me.emptyTable = true;
      }

    } else {
      me.empty = true;
    }


    me.cols = me.data.tableData.headers[0].cols;
    me._selectedColumns = me.cols;
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

 //Method to search on the basis of selected header (i.e standard,custom and logs)

 searchBy(event) {
   console.log("entered into this....");
  let msg;
  this._dataHandlerService.$isStoreView = true;
  if (event == 'standard') {
    if ((this.flowpathID == '') && (this.correlationID.length == 0)) {
      msg="Enter either Correlation ID or  FlowpathID";
      this._dataHandlerService.msgs = [];
      this._dataHandlerService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
      //this.showErrorMsg("Enter either Correlation ID or  FlowpathID");
      return;
    }
    else if (this.flowpathID == '' && this.correlationID.length != 0) {
      this.flowpathID = '';
    }
    else if (this.flowpathID == '' && this.correlationID.length == 0) {
      this.correlationID = [];
    }

    this._ddrData.searchByCustomDataOptions = '';
    console.log("1................",this._ddrData.searchByCustomDataOptions);
    this._ddrData.customData = '';
    console.log("2................",this._ddrData.customData);

    // this._ddrData.correlationId = this.correlationID.join(",");
    // console.log("3................",this._ddrData.correlationId);
    this._ddrData.tierName = this.selectedtierList.join(",");
    console.log("4................",this._ddrData.tierName);
    this._ddrData.flowpathID = this.flowpathID;
    console.log("5................",this._ddrData.flowpathID);
    this._ddrData.product = this._cavConfig.$productName.toLocaleLowerCase();
    console.log("6................",this._ddrData.product);
    this._ddrData.dcName = this._TierStatusMenuHandlerService.dcName;
    console.log("7................",this._ddrData.dcName);
    this._ddrData.strGraphKey = this._config.$actTimePeriod;
    console.log("8................",this._ddrData.strGraphKey);
    this._ddrData.mode = this.mode;
    console.log("9................",this._ddrData.mode);
    // this._dataHandlerService.$isStoreView = true;
    this._cavConfig.$eDParam.dcName = this._dataContainer.$MultiDCsArr[0];
    console.log("10................",this._cavConfig.$eDParam.dcName);
    this._TierStatusMenuHandlerService.reportCase("searchByFlowpath");
    console.log("11................",this._TierStatusMenuHandlerService);
  }
  else if (event == 'custom') {
    console.log("entered into custom event ....");
    // if (this.selectedtierListForCustom == undefined || this.customRulesData.length == 0) {
    //   msg="Please fillup the required field(s)";
    //   this._dataHandlerService.msgs = [];
    //   this._dataHandlerService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
    //   //this.showErrorMsg("Please fillup the required field(s)");
    //   return;
    // }

    // finalVal : To make data of custom to send to ddr
    let finalVal = '';
    for (let key in this.customRulesData) {
      finalVal += this.customRulesData[key].name + ':-:' + this.customRulesData[key].value + ':' + this.customRulesData[key].operationName + ':1:';
    }
    finalVal = finalVal.substring(0, finalVal.length - 3);
    let searchByCustomArr = [];
    for (let key in this.customNameList) {
      searchByCustomArr.push(this.customNameList[key].value);
    }
    let searchByCustomDataOptions = searchByCustomArr.join(',');
    this._ddrData.correlationId = '';
    this._ddrData.flowpathID = '';
    this._ddrData.mode = '';

    this._ddrData.tierName = this.selectedtierList.join(",");
    this._ddrData.product = this._config.$productName.toLocaleLowerCase();
    this._ddrData.dcName = this._ddrData.dcName;
    this._ddrData.strGraphKey = this._config.$actTimePeriod;
    this._ddrData.searchByCustomDataOptions = searchByCustomDataOptions;
    this._ddrData.customData = finalVal;
    this._TierStatusMenuHandlerService.reportCase("searchByFlowpath");

  }

  // else if (event == 'logs') {
  //   if (this.correlationIDForLogs == undefined || this.flowpathIDForLogs == undefined || this.pattern == null || this.selectedtierListForLogs == undefined) {
  //     msg="Enter the required field(s)";
  //     this._dataHandlerService.msgs = [];
  //     this._dataHandlerService.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
  //     //this.showErrorMsg("Enter the required field(s)");
  //     return;
  //   }

  //   this._ddrData.correlationId = this.correlationIDForLogs;
  //   this._ddrData.tierName = this.selectedtierListForLogs.join(",");
  //   this._ddrData.flowpathID = this.flowpathIDForLogs;
  //   this._ddrData.product = this._config.$productName.toLocaleLowerCase();
  //   this._ddrData.testRun = this._dataHandlerService.cavConfig.$eDParam.testRun;
  //   this._ddrData.strGraphKey = this._config.$actTimePeriod;
  //   this._ddrData.pattern = this.pattern;

  //   this._TierStatusMenuHandlerService.createParam('searchByFlowpathLogs');
  // }

}
// saveCustomRules() {
//   this.customRulesData = ImmutableArray.push(this.customRulesData, this.customDetail);
//   this.customDetail = new customData();
// }  
    // }

  closeClick() {
    const me = this;
    me.hide();
    me.standardTier=[];
    me.standardMode=null;
    me.standardCorrelationId=[];
    me.standardFlowpathId=null;
    me.customTier=[];
    me.customName=null;
    me.customOperation=null; 
    me.logsTier=null;
    me.pattern=null;
    me.logsFlowpath=null;
    me.logsCorrelationId=null;
    me.stndVal=null;
    
  }
  checkStoreListData() {
    const me = this;
    let storeData = me.geolocationService.getStoreViewData();
    let storenamelist;
    let tiernamelist;
    let tier;
    console.log("storedata",storeData);
    if(storeData != null){me.storeViewDataOpt=[];
    for(let storeName in storeData){
      storenamelist = storeData[storeName]['storeName']
      tiernamelist = storeData[storeName]['tierName']
      tier = storenamelist + "!" + tiernamelist
      me.storeViewDataOpt.push({label: tier, value: tier});
    }
  }
  else{
    setTimeout(()=>{
      me.checkStoreListData();
    },500);
    return;
  }
}

  open() {
    const me = this; 
   
    me.show();
    
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }
}
