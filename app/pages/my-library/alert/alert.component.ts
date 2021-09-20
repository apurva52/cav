import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { InputText, LazyLoadEvent, MenuItem, MessageService, OverlayPanel, SelectItem, SortEvent, Table, TreeNode } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PAYLOAD_TYPE } from './alert-rules/alert-configuration/service/alert-config.dummy';
import { AlertDownloadService } from './service/alert-download.service';
import { AlertEventService } from './service/alert-event.service';
import { AlertsTable, Events, FilteredEventsWithTag, EventResponse } from './service/alert-table.model';
import { CounterLoadedState, CounterLoadingErrorState, EventsArrayLoadedState, EventsDataLoadedState, EventsDataLoadingErrorState, EventsDataLoadingState, EventsResLoadedState, FilterEventsArrayLoadedState, FilterEventsArrayLoadingErrorState, FilterEventsArrayLoadingState } from './service/alert-table.state';
import * as CONS from './alert-constants';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { FormatDateTimePipe } from 'src/app/shared/pipes/dateTime/dateTime.pipe';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { EventHistoryRequest, EventQuery, SeverityFilter } from './alert-filter/services/alert-filter.model';
import { AlertFilterLoadedStatus, AlertFilterLoadingErrorStatus, AlertFilterLoadingStatus } from './alert-filter/services/alert-filter.state';
import { AlertFilterService } from './alert-filter/services/alert-filter.service';
import { GlobalTimebarTimeLoadedState, GlobalTimebarTimeLoadingErrorState, GlobalTimebarTimeLoadingState } from 'src/app/shared/time-bar/service/time-bar.state';
import { RuleConfig, RulePayload } from './alert-rules/alert-configuration/service/alert-config.model';
import { environment } from 'src/environments/environment';
import { AlertRulesService } from './alert-rules/service/alert-rules.service';
import { AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, AlertRuleDataLoadingState } from './alert-rules/service/alert-rules.state';
import * as moment from 'moment';
import { AlertTimeAgo } from 'src/app/shared/pipes/dateTime/alert/alert-timeAgo.pipe';
import { AlertFilterComponent } from './alert-filter/alert-filter.component';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { TimebarTimeConfig } from 'src/app/shared/time-bar/service/time-bar.model';
import * as _ from 'lodash';
import { AdvancedConfigurationService } from './alert-configuration/advanced-configuration/service/advanced-configuration.service';
import { ALERT_MODULES } from './alert-constants';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AlertComponent implements OnInit {
  activeTab: MenuItem;

  data: AlertsTable;
  dataUsedToFilter: FilteredEventsWithTag[];
  filterDataMap = {};
  isFilterSort: boolean = false;
  sortOrder: number;
  totalRecords = 0;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  cols_alert_val: { field: string; header: string; }[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  alertSetting: MenuItem[];
  searchOptions: SelectItem[];
  isActHis: string = "active";
  selectedRow: Events[] = [];
  selectedAll: boolean;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  rowGroupMetadata: any[];
  public expandedRows = {};
  severityObj = {};
  dateTimePipe: FormatDateTimePipe;
  timeAgo: AlertTimeAgo;

  sec: any;
  min: any;
  hour: any;
  ref: any;

  @ViewChild('alert') table: Table;
  @ViewChild('alertrow') _table : Table;
  @ViewChild('alertFilterSidebar') alertFilterSideBar: AlertFilterComponent;
  @ViewChild('opAlertEve') opAlertEve: OverlayPanel;
  @ViewChild('searchInputTemplate') glbSearch: InputText;

  hierarchyOptions: { label: string; value: number; }[];
  globalFilterVla: any;

  alertValEvl= new Tree();
  loadingRBtn: boolean;
  selectedRForProgress: string;
  isOnlyReadable: boolean;
  //loadingRBtn: boolean;


  constructor(private router: Router,
    public _alertEventService: AlertEventService,
    private messageService: MessageService,
    public alertDownloadService: AlertDownloadService,
    private dashboardService: DashboardService,
    private sessionService: SessionService,
    private alertFilterService: AlertFilterService,
    private alertRulesService: AlertRulesService,
    private timebarService: TimebarService,
    private advConfigService: AdvancedConfigurationService,
    public alertCapability: AlertCapabilityService,
    public breadcrumb: BreadcrumbService) {
      this.dateTimePipe = new FormatDateTimePipe(sessionService, advConfigService);
      this.timeAgo = new AlertTimeAgo(sessionService, advConfigService);
    }

  ngOnInit(): void {
    const me = this;
    me._alertEventService.isShowGui = false;
    me.isOnlyReadable = me.alertCapability.isModuleOnlyReadable(ALERT_MODULES.ALERT_EVENT);
    me.breadcrumb.addNewBreadcrumb({ label: 'Alerts', routerLink: ['/my-library/alert'] });
    /* me.breadcrumb = [
      { label: 'Home' },
      { label: 'My-Library' },
      { label: 'Alerts' },
    ]; */
    me.downloadOptions = [
      { label: 'WORD', command: (event) => { me.downloadReport('worddoc') } },
      { label: 'PDF', command: (event) => { me.downloadReport('pdf'); } },
      { label: 'EXCEL', command: (event) => { me.downloadReport('excel'); } }
    ];
    me.alertSetting = [
      {
        label: 'Alert Configuration',
        routerLink: ['/alert-configure'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_CONFIGURATION)
      },
      {
        label: 'Alert Maintenance',
        routerLink: ['/alert-maintenance'],
        visible: me.alertCapability.isHasPermission(ALERT_MODULES.ALERT_MAINTENANCE)
      }
    ];
    me.searchOptions = [
      { label: 'Active', value: 'active' },
      { label: 'History', value: 'history' }
    ];

    me.hierarchyOptions = [
      /* { label: 'Level1', value: 0 },
      { label: 'Level2', value: 1 } */
    ];

    me.resetCounter();

    me._alertEventService.hierarchy = { label: 'Level0', value: -1 };
    me._alertEventService.level = -1;

    if(me.alertDownloadService.isDownloading)
      me.alertDownloadService.isDownloading = !me.alertDownloadService.isDownloading;

    if(history.state.isActHis)
    {
      me.isActHis = history.state.isActHis;
      me._alertEventService.isShowGui = true;
      me.loadActiveOnHistoryChange();
    }
    else
    {
      me.eventLoad(me.data);
      me.eventCounter(CONS.SEVERITY.ALL_SEVERITY);
    }
  }

  resetCounter()
  {
    const me = this;

    me.severityObj["Critical"] = {counter: 0};
    me.severityObj["Major"] = {counter: 0};
    me.severityObj["Minor"] = {counter: 0};
  }

  getRefreshTime(){
    const me = this;
    me.hour = '00' ;
    me.min = '00' ;
    me.sec = '00' ;
    var time1 = new Date().getTime();
    me.ref = setInterval(function() {
      var time2 = new Date().getTime();
      var distance = time2 - time1;
      
      me.hour = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      me.min = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      me.sec = Math.floor((distance % (1000 * 60)) / 1000);

      if(me.hour < 10){
        me.hour = '0'+me.hour;
      }
      if(me.min < 10){
        me.min = '0'+me.min;
      }
      if(me.sec < 10){
        me.sec = '0'+me.sec;
      }
    },1000);
  }

  downloadReport(type: string) {
    const me = this;
    if (!me.selectedRow || me.selectedRow.length == 0) {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'No row is selected. Select record to download Alert Event(s).' });
      return;
    }
    
    me.alertDownloadService.isDownloading = !me.alertDownloadService.isDownloading;
    me.alertDownloadService.filterDataMap = me.filterDataMap;
    me.alertDownloadService.isActHis = me.isActHis;
    me.alertDownloadService.alertFilterSideBar = me.alertFilterSideBar;
    me.alertDownloadService.globalFilterVla = me.globalFilterVla;

    if(me.isActHis == 'active')
      me.alertDownloadService.downloadReport(type, ObjectUtility.duplicate(me.selectedRow), me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_ACTIVE_ALERT,[]);
    else
      me.alertDownloadService.downloadReport(type, ObjectUtility.duplicate(me.selectedRow), me._selectedColumns, PAYLOAD_TYPE.DOWNLOAD_ALERT_HISTORY, []);

    if(me.selectedAll)
      me.selectedAll = !me.selectedAll

    me.alertDownloadService.filterDataMap = {};
    me.alertDownloadService.isActHis = "";
    me.alertDownloadService.alertFilterSideBar = null;
    me.selectedRow = [];
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  selectedAllData() {
    const me = this;
    //me.selectedAll = !me.selectedAll
    if (me.selectedAll) {
      me.selectedRow = [];
      if (me.data.data) {
        for (let i = 0; i < me.data.data.length; i++) {
          me.data.data[i].events.forEach(event => {
            me.selectedRow.push(event);
          });
        }
      }
    } else {
      me.selectedRow = [];
    }
  }
  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
      me.data.data = ObjectUtility.duplicate(me.dataUsedToFilter);
      me.filterDataMap = {};

      if(me.globalFilterVla)
        me.filter(me.globalFilterVla, "-1", "");
    }
  }
  showAlertRules() {
    this.router.navigate(['/alert-rules']);
  }
  showActionList() {
    this.router.navigate(['/alert-actions']);
  }
  showBasline() {
    this.router.navigate(['/alert-baseline']);
  }


  eventLoad(data: AlertsTable) {
    const me = this;
    me._alertEventService.load(data).subscribe(
      (state: Store.State) => {
        if (state instanceof EventsDataLoadingState) {
          me.onEventLoading(state);
          return;
        }

        if (state instanceof EventsDataLoadedState) {
          me.onEventLoaded(state);
          return;
        }
      },
      (state: EventsDataLoadingErrorState) => {
        me.onEventLoadingError(state);
      }
    );
  }

  eventCounter(severityType?: number)
  {
    const me = this;
    me.resetCounter();
    if(severityType == CONS.SEVERITY.ALL_SEVERITY)
    {
      me._alertEventService.allCounter().subscribe(
        (state: Store.State) => {
          if (state instanceof CounterLoadedState) {
            me.onSeverityCount(state, severityType);
            return;
          }
        },
        (state: CounterLoadingErrorState) => {
          //me.onEventLoadingError(state);
        }
      );
    }
    else
    {
      me._alertEventService.severityEventCounter(severityType).subscribe(
        (state: Store.State) => {
          if (state instanceof CounterLoadedState) {
            me.onSeverityCount(state, severityType);
            return;
          }
        },
        (state: CounterLoadingErrorState) => {
          //me.onEventLoadingError(state);
        }
      );
    }
  }

  private onEventLoading(state: EventsDataLoadingState) {
    const me = this;
    // me.dataTable.data = null;
    me._alertEventService.error = null;
    me.empty = false;
    me.loading = true;
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
  }

  private onEventLoadingError(state: EventsDataLoadingErrorState) {
    const me = this;
    //me.dataTable.data = null;
    me._alertEventService.error = state.error;
    me.empty = false;
    me.loading = false;
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
  }

  private onEventLoaded(state: EventsDataLoadedState) {
    const me = this;
    if(!state.data.data)
      state.data.data = [];
        
      me.data = undefined;
      me.cols = [];
      me.globalFilterFields = [];
      me._selectedColumns = [];
      
      
      me.data = state.data;
      me.sortOnTagLabel();

    me._alertEventService.level = 0;
    me.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    if (me.data) {
      me.empty = !me.data.data.length;
      me.emptyTable = !me.data.data.length;
    }

    if(!me.empty)
    {
      me.hierarchyOptions = [];
      for(let i = 0; i <= me.data.maxHierarchy; i++)
      {
        me.hierarchyOptions.push({label: 'Level' + i, value: (i - 1)});
      }

      me.expandTheFirstRow()
    }
    
    me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
    me.setStateCount();
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;

    me._alertEventService.error = state.error;
    me.loading = false;
    me.globalFilterVla = undefined;
    me.filter("", -3, "");

    if(state.data.counter)
    {
      state.data.counter.forEach(element => {
        if(me.severityObj[element.name])
          me.severityObj[element.name] = {counter: element.count};
      });
    }

    clearInterval(me.ref);
    me.getRefreshTime();
  }

  setStateCount()
  {
    const me = this;
    me.data.data.forEach(filterEvents => {
      filterEvents.events.forEach(event => {
        if(me._alertEventService.stateCount[event.reason] != null && me._alertEventService.stateCount[event.reason] != undefined)
          me._alertEventService.stateCount[event.reason] = ++me._alertEventService.stateCount[event.reason];
      });
    });
  }

  onSeverityCount(state: CounterLoadedState, severity?: number)
  {
    const me = this;
    if(state.data)
    {
      if(severity == CONS.SEVERITY.ALL_SEVERITY)
      {
        state.data.forEach(element => {
          me.updateSeverityObj(element.name, element.count);
        });
      }
      else if(severity == CONS.SEVERITY.CRITICAL)
      {
        state.data.forEach(element => {
          if(element.name == CONS.SEVERITY.CRITICAL_STRING)
            me.updateSeverityObj(element.name, element.count);
        });
      }
      else if(severity == CONS.SEVERITY.MAJOR)
      {
        state.data.forEach(element => {
          if(element.name == CONS.SEVERITY.MAJOR_STRING)
            me.updateSeverityObj(element.name, element.count);
        });
      }
      else if(severity == CONS.SEVERITY.MINOR)
      {
        state.data.forEach(element => {
          if(element.name == CONS.SEVERITY.MINOR_STRING)
            me.updateSeverityObj(element.name, element.count);
        });
      }
      else if(severity == CONS.SEVERITY.INFO)
      {
        state.data.forEach(element => {
          if(element.name == CONS.SEVERITY.INFO_STRING)
            me.updateSeverityObj(element.name, element.count);
        });
      }
    }
  }

  expandTheFirstRow()
  {
    this.expandedRows = {};

    this.expandedRows[this.data.data[0].tagging] = true;
    /* this.data.data[0].totalRecords = 20;
    this.data.data[0].loading = false; */
  }

  updateSeverityObj(severity: string, counter: number)
  {
    this.severityObj[severity] = {counter: counter};
  }

  public refreshActiveAlert()
  {
    const me = this;

    if(!me._alertEventService.isShowGui)
      return;
    
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui; 

    if (me.isActHis == 'history') {
      me._alertEventService.hierarchy = { label: 'Level0', value: -1 };
      me._alertEventService.level = -1;
      //me.alertFilterSideBar.ngOnInit();
      me.loadHistoryData(false);
      return;
    }
    me.data.severities.forEach(element => {
      if(element.name == "All")
        element.selected = true;
      else
        element.selected = false;
    });
    me.eventCounter(CONS.SEVERITY.ALL_SEVERITY);
    me._alertEventService.hierarchy = { label: 'Level0', value: -1 };
    me._alertEventService.level = -1;
    me._alertEventService.all(me.data).subscribe(
      (state: Store.State) => {
        if (state instanceof FilterEventsArrayLoadingState) {
          me.onEventArrayLoading(state);
          return;
        }

        if (state instanceof FilterEventsArrayLoadedState) {
          me.onEventArrayLoaded(state);
          return;
        }
      },
      (state: FilterEventsArrayLoadingErrorState) => {
        me.onEventArrayLoadingError(state);
      }
    );
  }
  onEventArrayLoadingError(state: FilterEventsArrayLoadingErrorState) {
    const me = this;
    //me.dataTable.data = null;
    me._alertEventService.error = state.error;
    me.empty = false;
    me.loading = false;
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
  }

  onEventArrayLoading(state: FilterEventsArrayLoadingState) {
    const me = this;
    // me.dataTable.data = null;
    me._alertEventService.error = null;
    me.empty = false;
    me.loading = true;
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
  }

  public severityEvents(severityType?: number)
  {
    const me = this;
    me._alertEventService.severityEvents(me.data, severityType).subscribe(
      (state: Store.State) => {
        if (state instanceof FilterEventsArrayLoadingState) {
          //me.onEventLoading(state);
          return;
        }

        if (state instanceof FilterEventsArrayLoadedState) {
          me.onEventArrayLoaded(state);
          return;
        }
      },
      (state: FilterEventsArrayLoadingErrorState) => {
        //me.onEventLoadingError(state);
      }
    );
  }

  public onTagHierarchyChg()
  {
    const me  = this;

    me.selectedRow = [];
    if(me.selectedAll)
      me.selectedAll = !me.selectedAll;

    if(!me._alertEventService.isShowGui)
      return;

    me._alertEventService.level = me._alertEventService.hierarchy.value;
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;

    if(me.isActHis == 'history')
    {
      me.alertFilterSideBar.timeFilterApply();
      return;
    }

    me.data.severities.forEach(element => {
      if(element.name == "All")
        element.selected = true;
      else
        element.selected = false;
    });
    me.eventCounter(CONS.SEVERITY.ALL_SEVERITY);
    
    me._alertEventService.all(me.data).subscribe(
      (state: Store.State) => {
        if (state instanceof FilterEventsArrayLoadingState) {
          //me.onEventLoading(state);
          return;
        }

        if (state instanceof FilterEventsArrayLoadedState) {
          me.onEventArrayLoaded(state);
          return;
        }
      },
      (state: FilterEventsArrayLoadingErrorState) => {
        //me.onEventLoadingError(state);
      }
    );
  }

  onEventArrayLoaded(state: FilterEventsArrayLoadedState) {
    //throw new Error('Method not implemented.');
    const me = this;
    me._alertEventService.isShowGui = true;
    me.table._sortField = null;
    if(state.data)
      me.data.data = state.data;
    else
      me.data.data = [];

    me.sortOnTagLabel();

    if (me.data) {
      me.empty = !me.data.data.length;
      me.emptyTable = !me.data.data.length;
    }

    me.data.data = [...me.data.data];

    me.data.data.forEach(element => {
      element.events = [...element.events];
    });

    if(me.data.data != null && me.data.data.length != 0)
      me.expandTheFirstRow();

    me.hierarchyOptions = [];
    for(let i = 0; i <= me._alertEventService.level; i++)
    {
      me.hierarchyOptions.push({label: 'Level' + i, value: (i - 1)});
    }

    me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);

    if(me.isEnabledColumnFilter)
      me.toggleFilters();
      
    me.filter("", -2, "");

    me.selectedRow = [];

    clearInterval(me.ref);
    me.getRefreshTime();
  }

  forceClear(){
    const me = this;

    if(!me._alertEventService.isShowGui)
      return;

    if (!me.selectedRow || me.selectedRow.length == 0){
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one record.' });
      return;
    }

    let minHierarchy = 0;

    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
    me._alertEventService.forceclear(this.selectedRow).subscribe( res=>{

      if(res instanceof EventsArrayLoadedState)
      {
        if(res.data)
        {
          res.data.forEach(event => {
            me.data.data.forEach((rowData, rowInx) => {
  
              rowData.events.forEach((clearedEvent, index) => {
                if(event.id == clearedEvent.id)
                {
                  rowData.events.splice(index ,1);
                  rowData.events = [...rowData.events];
                }
              });
  
              if(rowData.events.length == 0)
                me.data.data.splice(rowInx, 1);
  
            })
          });
          me.data.data = [...me.data.data];
        }


        if (me.data) {
          me.empty = !me.data.data.length;
          me.emptyTable = !me.data.data.length;
          minHierarchy = 0;
        }
        else
        {
          me.data.data.forEach(events => {
            events.events.forEach(event => {
              if(minHierarchy < event.subject.tags.length)
                  minHierarchy = event.subject.tags.length;
            });
          });
        
          me._alertEventService.level = 0;
          me.hierarchyOptions = [];
          for(let i = 1; i <= minHierarchy; i++)
          {
            me.hierarchyOptions.push({label: 'Level' + i, value: (i - 1)});
          }  

        }

        me.selectedRow = [];
        me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
        me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
        me.eventCounter(CONS.SEVERITY.ALL_SEVERITY);
      }
    });
  }

  ackThisEvents(){
    const me = this;

    if(!me._alertEventService.isShowGui)
      return;

    if (!me.selectedRow || me.selectedRow.length == 0){
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one record to acknowledge.' });
      return;
    }

    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;

    let selectedRow: Events[] = ObjectUtility.duplicate(me.selectedRow);
    selectedRow.forEach(element => {
      element.ack = true;
    });

    me._alertEventService.update(selectedRow).subscribe( res=>{

      if(res instanceof EventsResLoadedState)
      {
        if(res.data.events)
        {
          res.data.events.forEach(event => {
            me.data.data.forEach((rowData) => {
              rowData.events.forEach((updateEvent, index) => {
                if(event.id == updateEvent.id)
                {
                  rowData.events[index] = event;
                  rowData.events = [...rowData.events];
                }
              });
            })
          });
          me.data.data = [...me.data.data];
        }


        me.selectedRow = [];

        if(me.selectedAll)
          me.selectedAll = !me.selectedAll

        me._alertEventService.statusUpdate(res.data.status);

        me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
        me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
      }
    });
  }

  onRowSelect(event: any){
  }

  onRowClick(event: any, rowIndex: number){
  }

   onButtonClick(row: FilteredEventsWithTag)
  {
    const me = this;
    me.loadingRBtn = true;
    let temp  = row.tagging;
    me.selectedRForProgress = row.tagging;
    if(temp in me.expandedRows)
        {
           me.selectedRForProgress = row.tagging;
           me.loadingRBtn = true;
         }
         else{
         me.loadingRBtn = false;
       }
    let ref = setInterval(function() {
      me.loadingRBtn = false;
      clearInterval(ref);
    },20 * row.events.length)
  } 

  filter(value: any, field: any, matchMode: any)
  {
    const me = this;

    
    if(field != "-1" && field != -2)
      me.filterDataMap[field] = {value: value};

    if(field == -3)
      me.filterDataMap = {};
    
    let dataUsedToFilter: FilteredEventsWithTag[] = ObjectUtility.duplicate(me.dataUsedToFilter);

    if(!dataUsedToFilter)
      return;

    if(me.filterDataMap)
    {
      me._selectedColumns.forEach(col => {
        if(me.filterDataMap[col.label] != null)
        {
          dataUsedToFilter.forEach((element, index) => {

            //element.loading = true;
  
            me.data.data[index].events = element.events.filter((event) => {
  
              if(me.filterWithParameter(col, event, me.filterDataMap[col.label].value))
                return true;
            });
          });
  
          dataUsedToFilter = ObjectUtility.duplicate(me.data.data);
        }
      });
    }

    if(me.globalFilterVla || field == "-1")
    {
      if(field == "-1")
        me.globalFilterVla = value;

      dataUsedToFilter.forEach((element, index) => {

        //element.loading = true;

        me.data.data[index].events = element.events.filter((event) => {

          for(let i = 0; i < me._selectedColumns.length; i++)
          {

            if(me.filterWithParameter(me._selectedColumns[i], event, me.globalFilterVla))
              return true;
          }
        });
      });
    }
    clearInterval(this.ref);
    this.getRefreshTime();
    me._table._first = 0;
    if(field == -3 || field == "-1")
      return;
    else
      me.filterSort(dataUsedToFilter);

  }

  filterWithParameter(col: TableHeaderColumn, event: Events, value: any)
  {
    const me = this;

    if(col.label == 'Select' || col.label == "Ack")
      return false;

    if(col.label == 'Alert Time')
    {
      if(me.dateTimePipe.transform(event[col.valueField], 'default').toLowerCase().includes(value.toLowerCase()))
        return true;
    }
    else if(col.label == 'Time Ago')
    {
      if(me.timeAgo.transform(event[col.valueField]).toLowerCase().includes(value.toLowerCase()))
        return true;
    }
    else
    {
      if((event[col.valueField]? event[col.valueField] : "").toLowerCase().includes(value.toLowerCase()))
        return true;
    }
  }

  filterSort(data: any){
    const me = this;

    const sort = {
      data: data,
      field: me.table.sortField,
      mode: me.table.sortMode,
      order: me.table.sortOrder
    };

    me.isFilterSort = true;

    me.table.sort(sort);
   
  }

  sortOnTagLabel()
  {
    const me = this;

    me.data.data.sort(
      (data1, data2) => {
        let value1 = data1["tagging"] == 'Default'? 'Configuration': data1["tagging"];
        let value2 = data2["tagging"] == 'Default'? 'Configuration': data2["tagging"];
        let result = null;

        if (value1 == null && value2 != null)
              result = -1;
          else if (value1 != null && value2 == null)
              result = 1;
          else if (value1 == null && value2 == null)
              result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string')
              result = value1.localeCompare(value2);
          else
              result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
          
          return result;
      }
    );
  }

  customSort(events: SortEvent)
  {

    if(this.isFilterSort){
      if(this.sortOrder){
        events.order = this.sortOrder;
        this.table._sortOrder = events.order;
      }
    }

    events.data.forEach(tagging => {
      tagging.events.sort((data1, data2) => {
          let value1 = data1[events.field];
          let value2 = data2[events.field];
          let result = null;

          if (value1 == null && value2 != null)
              result = -1;
          else if (value1 != null && value2 == null)
              result = 1;
          else if (value1 == null && value2 == null)
              result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string')
              result = value1.localeCompare(value2);
          else
              result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

          return this.isFilterSort?(this.sortOrder * result):(events.order * result);
      });
    });

    if(!this.isFilterSort){
      this.sortOrder = events.order;
      this.table._sortOrder = this.sortOrder;
    }
    
    if(this.isFilterSort)  
      this.isFilterSort = !this.isFilterSort;

  }

  severityFilter(severity: any)
  {
    const me = this;

    me.data.severities.forEach(element => {
      if(element == severity)
        element.selected = true;
      else
        element.selected = false;
    });

    me.selectedRow = [];

    if(me.selectedAll)
      me.selectedAll = !me.selectedAll

    if(!me._alertEventService.isShowGui)
      return;

    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
    me._alertEventService.level = me._alertEventService.hierarchy.value;
    if(severity.name == CONS.SEVERITY.CRITICAL_STRING)
    {
      me.eventCounter(CONS.SEVERITY.CRITICAL);
      me.severityEvents(CONS.SEVERITY.CRITICAL);
    }
    else if(severity.name == CONS.SEVERITY.MAJOR_STRING)
    {
      me.eventCounter(CONS.SEVERITY.MAJOR);
      me.severityEvents(CONS.SEVERITY.MAJOR);
    }
    else if(severity.name == CONS.SEVERITY.MINOR_STRING)
    {
      me.eventCounter(CONS.SEVERITY.MINOR);
      me.severityEvents(CONS.SEVERITY.MINOR);
    }
    else if(severity.name == CONS.SEVERITY.INFO_STRING)
    {
      me.eventCounter(CONS.SEVERITY.INFO);
      me.severityEvents(CONS.SEVERITY.INFO);
    }
    else if(severity.name == "All"){
      me.eventCounter(CONS.SEVERITY.ALL_SEVERITY);
      me._alertEventService.all(me.data).subscribe(
        (state: Store.State) => {
          if (state instanceof FilterEventsArrayLoadingState) {
            //me.onEventLoading(state);
            return;
          }
  
          if (state instanceof FilterEventsArrayLoadedState) {
            me.onEventArrayLoaded(state);
            return;
          }
        },
        (state: FilterEventsArrayLoadingErrorState) => {
          //me.onEventLoadingError(state);
        }
      );
    }
    else
    {
      me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
      me.refreshActiveAlert();
    }
  }

  openGraphInDashboard()
  {
    const me = this;

    if(!me._alertEventService.isShowGui)
      return;

    if (!me.selectedRow || me.selectedRow.length == 0){
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select at least one record to open graph.' });
      return;
    }

    var size = 0;
    var isElegible = 0;
    me.selectedRow.forEach(element => {
      if(element.metrics != null && element.metrics.length != 0
        && element.conditions != null && element.conditions.conditionList != null
        && element.conditions.conditionList.length != 0)
        isElegible = 1;

      size++;
    });

    if(size == 1 && isElegible == 0)
    {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selected event is not elegible for open graph' });
      return;
    }
    if(size > 1 && isElegible == 0)
    {
      me.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selected events are not elegible for open graph' });
      return;
    }

    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
    me.dashboardService.events = me.selectedRow;
    me.dashboardService.isCallFromAlert = true;

    this.router.navigate(['/home']);
    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;
  }

  /* onRowExpand(row: FilteredEventsWithTag)
  {
    row['loading'] = true;
  }

  loadCustomers(event: LazyLoadEvent, row: FilteredEventsWithTag) {

    setTimeout(() => {
            row['totalRecords'] = 20;
            row['loading'] = false;
    }, 1000);
  } */

  upDateHistoryTable(res)
  {
    const me = this;

    if(res.filterdEvents)
      me.data.data = res.filterdEvents;//EventResponse
    else
      me.data.data = [];
    
    me.data.data = [...me.data.data];
    me.sortOnTagLabel();

    if (me.data) {
      me.empty = !me.data.data.length;
      me.emptyTable = !me.data.data.length;
    }

    me.hierarchyOptions = [];
    for(let i = 0; i <= me._alertEventService.level; i++)
    {
      me.hierarchyOptions.push({label: 'Level' + i, value: (i - 1)});
    }

    if(me.data.data != null && me.data.data.length != 0)
      me.expandTheFirstRow();

    me._alertEventService.isShowGui = !me._alertEventService.isShowGui;

    if(res.counter)
    {
      res.counter.forEach(element => {
        if(me.severityObj[element.name])
          me.severityObj[element.name] = {counter: element.count};
      });
    }
    else
    {
      me.severityObj["Critical"] = {counter: 0};
      me.severityObj["Major"] = {counter: 0};
      me.severityObj["Minor"] = {counter: 0};
    }

    me.setStateCount();
    
    me.selectedRow = [];

    clearInterval(this.ref);
    this.getRefreshTime();

    me.dataUsedToFilter = ObjectUtility.duplicate(me.data.data);

    if(me.isEnabledColumnFilter)
      me.toggleFilters();
      
    me.filter("", -2, "");
  }

  loadActiveOnHistoryChange() {
    const me = this;

    me.selectedRow = [];

    if(me.selectedAll)
      me.selectedAll = !me.selectedAll;

    if(!me._alertEventService.isShowGui)
    {
      return;
    }

    me._alertEventService.isShowGui = false;

    me._alertEventService.hierarchy = { label: 'Level0', value: -1 };
    me._alertEventService.level = 0;

    if (me.isActHis == 'active') {
      me.eventLoad(me.data);
      me.eventCounter(CONS.SEVERITY.ALL_SEVERITY);
    }
    else {
      if(me.alertFilterSideBar)
        me.alertFilterSideBar.ngOnInit();
        
      me.loadHistoryData(true);
    }
  }

  loadHistoryData(isLoadHis: boolean)
  {
    const me = this;
    let st: number;
    let et: number;

    let selectedPreset: any;
    if(isLoadHis)
      selectedPreset = me.alertFilterService.syncPreset(me.timebarService, CONS.ALERT_PRESETS);
    else{
      selectedPreset = me.alertFilterSideBar.selectedPreset;
      me.alertFilterSideBar.multiSelect.filterValue = '';
    }

    if(selectedPreset != 'custom')
    {
      this.alertFilterService.loadTime(selectedPreset).subscribe(
        (state: Store.State) => {
          if (state instanceof GlobalTimebarTimeLoadingState) {
            return;
          }
  
          if (state instanceof GlobalTimebarTimeLoadedState) {
            st = state.data[1];
            et = state.data[2];
            me.applyingHistoryPayLoad(st, et, isLoadHis);
          }
        },
        (state: GlobalTimebarTimeLoadingErrorState) => {
          console.error("Error in auto update", state.error);
        }
      )
    }
    else{
      const customTime: TimebarTimeConfig = me.timebarService.getTimeConfig(
        _.get(me.timebarService.tmpValue, 'timePeriod.selected.id', '')
      );

      me.alertFilterSideBar.st = st = customTime.frameStart.value;
      me.alertFilterSideBar.et = et = customTime.frameEnd.value;
      me.applyingHistoryPayLoad(st, et, isLoadHis);
    }
  }

  applyingHistoryPayLoad(st: number, et: number, isLoadHis: boolean)
  {
    const me = this;
    let newAlert: number[] = [];
    let severityList: SeverityFilter[] = [];

    me.resetCounter();

    newAlert.push(CONS.SEVERITY.CRITICAL);
    newAlert.push(CONS.SEVERITY.MAJOR);
    newAlert.push(CONS.SEVERITY.MINOR);

    newAlert.forEach(element => {

      let severityF: SeverityFilter = {
        severity: element,
        reason: CONS.STATUS.STARTED,
        prevSeverity: CONS.SEVERITY.NORMAL
      }
      severityList.push(severityF);
    });

    let endedAlert: number[] = []
    endedAlert.push(CONS.SEVERITY.CRITICAL);
    endedAlert.push(CONS.SEVERITY.MAJOR);
    endedAlert.push(CONS.SEVERITY.MINOR);

    endedAlert.forEach(element => {

      let severityF: SeverityFilter = {
        severity: CONS.SEVERITY.NORMAL,
        reason: CONS.STATUS.ENDED,
        prevSeverity: element
      }
      severityList.push(severityF);
    });

    let eventQuery: EventQuery = {
      ruleNames: [],
      others: [],
      severityFilter: severityList,
      st: st,
      et: et,
      subject: null
    }

    let payload: EventHistoryRequest = {
      cctx: null,
      opType: -1,
      clientId: '',
      appId: '',
      events: [],
      eventQuery: eventQuery
    }

    if(!isLoadHis)
    {
      me._alertEventService.applyFilters(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof AlertFilterLoadingStatus) {
  
          }
  
          if (state instanceof AlertFilterLoadedStatus) {
            me.upDateHistoryTable(state.data);
            
          }
        },
        (state: AlertFilterLoadingErrorStatus) => {
          console.error("Error in auto update", state.error);
        }
      )
    }
    else
    {
      this._alertEventService.loadHistoryFilter(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof EventsDataLoadingState) {
            me.onEventLoading(state);
            return;
          }
  
          if (state instanceof EventsDataLoadedState) {
            me.onEventLoaded(state);
            return;
          }
        },
        (state: EventsDataLoadingErrorState) => {
          me.onEventLoadingError(state);
        }
      )
    }
    
  }

  viewAlertRuleConfigurationWindow(data: Events) {
    const me = this;

    if(me.isActHis == 'history')
      return;

    const session = me.sessionService.session;
    if (session) {
      const cctx = {
        cck: session.cctx.cck,
        pk: session.cctx.pk,
        u: session.cctx.u,

      };
      const ruleConfig: RuleConfig = {
        id: data.ruleId
      }
      const payload: RulePayload = {
        cctx: cctx,
        opType: PAYLOAD_TYPE.GET_RULES,
        clientId: "-1",
        appId: "-1",
        rules: [ruleConfig]
      }
      const path = environment.api.alert.rule.any.endpoint;
      me.alertRulesService.genericLoad(false, PAYLOAD_TYPE.GET_RULES, AlertRuleDataLoadingState, AlertRuleDataLoadedState, AlertRuleDataLoadingErrorState, path, payload).subscribe(
        (state: Store.State) => {
          if (state instanceof AlertRuleDataLoadedState) {
            me.onRuleLoaded(state, data);
            return;
          }
        },
        (state: AlertRuleDataLoadingErrorState) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Alert Manager is refused to connect.' });
        });
    }
  }

  onChangeToggleColumn(event: any){
    const me = this;
    let isToggle: boolean = true;
    for (let index = 0; index < event.value.length; index++) {
      const element = event.value[index];
      if (element.label == event.itemValue.label){
          isToggle = false;
      }
    }
    if(isToggle){
    if (me.isEnabledColumnFilter) {
        for (let prop in me.filterDataMap) {
          if (event.itemValue.label == prop) {
            if(me.globalFilterVla){
            me.filter(me.globalFilterVla, "-1", '');
            }
            else{
              me.filter('', "-1", '');
            }
          }
        }
    }
  }
    me.filterDataMap = {};
  }

  private onRuleLoaded(state: AlertRuleDataLoadedState, data: Events) {
    const me = this;
    me.router.navigate(['/alert-configuration'], { state: { data: state.data.data[0].rule, viewData: { callFrom: 'ACTIVE_ALERT', st: data.st, et: data.et, metrics: data.metrics}}});
  }

  public alertValueEvaluation(event: Events, overlayEve: any, actualTarget: any)
  {

    if(event.metrics == null && event.metrics.length == 0
      && event.conditions == null && event.conditions.conditionList == null
      && event.conditions.conditionList.length == 0)
      return;

    const me = this;
    me.alertValEvl = new Tree();

    me.cols_alert_val = [
      { field: 'subject', header: 'Subject' },
      { field: 'value', header: 'Value' }
    ]

    for(var i = 0; i < event.conditions.conditionList.length; i++)
    {
      event.metrics.forEach(perMetric => {
        if(event.conditions.conditionList[i].mName == perMetric.name)
        {
          let parentNode: any = me.alertValEvl.data.filter((parentNode) =>{
            if((event.conditions.conditionList[i].name + "_" + perMetric.name) == parentNode.data.abb)
              return parentNode;
          })[0];
    
          if(!parentNode)
          {
            parentNode = me.creationOfNode(event.conditions.conditionList[i].name + "( " + perMetric.measure.metric + " )", 
            event.conditions.conditionList[i].name + "_" + perMetric.name, "", i);
            me.alertValEvl.data.push(parentNode);
          }
  
  
          let vName = "";
          perMetric.subject.forEach(subject => {
            subject.tags.forEach(tag => {
    
              if(vName == "")
                vName = tag.value;
              else
                vName = vName + ">" + tag.value;
            });
          });
    
          parentNode.children.push(me.creationOfNode(vName, "", perMetric.value, -1));
        }
      });
    }

    /* me.alertValEvl = [
      {
        data: 
        {
          abb: "B",
          subject: "C2",
          value: ""
        },
        children: [
          {
            data: {abb: "B",
            subject: "C2",
            value: ""},
          }
        ]
      }
    ] */

    me.opAlertEve.toggle(overlayEve, actualTarget);
    
  }

  public creationOfNode(name: string, abbName: string, val: any, pos: number)
  {
    let isExpanded = false;

    if(pos == 0)
      isExpanded = true;

    let parentNode: TreeNode = {
      data: {
        subject: name,
        abb: abbName,
        value: val == -1? "NAN" : val
      },

      children: [],
      expanded: isExpanded,
    }

    return parentNode;
  }
}

function Tree() {
  this.data = [];
}
