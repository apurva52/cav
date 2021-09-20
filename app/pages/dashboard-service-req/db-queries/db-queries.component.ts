import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { DbQueriesPanel, DbQueriesTableHeaderCols } from './service/db-queries.model';
import { DbQueriesService } from './service/db-queries.service';
import { DbQueriesLoadingState, DbQueriesLoadedState, DbQueriesLoadingErrorState, DownloadReportLoadingState, DownloadReportLoadingErrorState, DownloadReportLoadedState} from './service/db-queries.state';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { FilterUtils } from 'primeng/utils';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardServiceReqService } from '../service/dashboard-service-req.service';
import { Subscription } from 'rxjs';
import { GlobalDrillDownFilterService } from 'src/app/shared/global-drilldown-filter/service/global-drilldown-filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-db-queries',
  templateUrl: './db-queries.component.html',
  styleUrls: ['./db-queries.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe]
})
export class DbQueriesComponent implements OnInit {

  data: DbQueriesPanel;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  dbQueryDataTemp = [];
  totalQueryCount=0;
  queryName: String= "";
  stateID: string;

  selectedFilter = "Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All";
  cols: DbQueriesTableHeaderCols[] = [];
  _selectedColumns: DbQueriesTableHeaderCols[] = [];
  downloadOptions: MenuItem[];

  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  finalValue: any;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  dbQueriesData = [];
  totalRecords = 0;
  isSource: any;
  reportID: any;
  isFromWidget:boolean = false;
  isFromFlowPath:boolean = false;
  isShowSearch: boolean;
  refreshTable:boolean = false;
  restgrphdata:any;
  subscribeDbQuery:Subscription;
  breadcrumb: BreadcrumbService;
  headerName: String;
  showPagination: boolean = false;

  @ViewChild("dbQueries") dbQueries: ElementRef;
  globalFilterFields: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  constructor(private dbQueriesService: DbQueriesService, private sessionService: SessionService,
    private dashboardServiceReqService: DashboardServiceReqService, 
    private router: Router, private route: ActivatedRoute,
    private globalDrillDownFilterService: GlobalDrillDownFilterService,
    breadcrumb: BreadcrumbService
    ) { 
      this.breadcrumb = breadcrumb;
      this.route.queryParams.subscribe((params) => {
       this.stateID = params['state'];
      });
    }

  ngOnInit(): void {
    const me = this;
    me.loadDbQuery();
    this.globalDrillDownFilterService.currentReport = "DB Report";
    this.subscribeDbQuery = this.dashboardServiceReqService.splitViewObservable$.subscribe((temp) => {
      me.data= null;
      me.breadcrumb['items'][me.breadcrumb['items'].length - 1].label = me.sessionService.getSetting("fpRowdata").flowpathInstance; //getting selected flowpath istance in breadcrumb
      me.loadDbQuery();
    });

    this.subscribeDbQuery = this.globalDrillDownFilterService.sideBarUIObservable$.subscribe((temp) => {
      if (this.globalDrillDownFilterService.currentReport == "DB Report") {
        me.loadDbQuery(temp);
      }
    });

    me.downloadOptions = [
      {
        label: 'Word',
        command: () => {
          const me = this;
          me.downloadShowDescReports("worddoc");
        }
      },
      {
        label: 'Excel',
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
  }


  loadDbQuery(cqmFilter?) {
    const me = this;
    me.isSource = me.sessionService.getSetting("ddrSource");
    me.reportID = me.sessionService.getSetting("reportID");
    if(me.reportID =="DBG_BT") {
      me.headerName = "DB Request By URL"
    }
    else if(me.isSource == "widget" && me.reportID =="DBR")
    {
      me.headerName = "Slow DB Calls By Response Time"
    }
    else {
      me.headerName = "DB Stats";
    }
    if (this.isSource == "widget" && (me.reportID == "DBR"|| me.reportID =="DBG_BT")) {
      if (cqmFilter) {
        me.dbQueriesService.loadFromCqm(cqmFilter).subscribe(
          (state: Store.State) => {
            if (state instanceof DbQueriesLoadingState) {
              me.onLoading(state);
              return;
            }

            if (state instanceof DbQueriesLoadedState) {
              me.onLoaded(state);
              return;
            }
          },
          (state: DbQueriesLoadingErrorState) => {
            me.onLoadingError(state);
          }
        );
      }
      else {
        me.breadcrumb.add({label: 'DB Queries', routerLink: 'dashboard-service-req/db-queries', queryParams: { state: me.stateID} } as MenuItem);
        me.dbQueriesService.loadFromWidget().subscribe(
          (state: Store.State) => {
            if (state instanceof DbQueriesLoadingState) {
              me.onLoading(state);
              return;
            }

          if (state instanceof DbQueriesLoadedState) {
            me.onLoaded(state);
            this.isFromWidget=true;
            this.isFromFlowPath=false;
            return;
          }
        },
        (state: DbQueriesLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }
    }else if(me.reportID =="ATF" || me.reportID =="isFromTrxnTableDB"){
      me.dbQueriesService.loadFromTrxFlowmap().subscribe(
        (state: Store.State) => {
          if (state instanceof DbQueriesLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof DbQueriesLoadedState) {
            me.onLoaded(state);
            me.sessionService.setSetting("reportID", "FP");
            this.isFromWidget=true;
            this.isFromFlowPath=false;
            return;
          }
        },
        (state: DbQueriesLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }
    else{
      me.dbQueriesService.loadFromFlowPath().subscribe(
        (state: Store.State) => {
          if (state instanceof DbQueriesLoadingState) {
            me.onLoading(state);
            return;
          }

          if (state instanceof DbQueriesLoadedState) {
            me.onLoaded(state);
            this.isFromFlowPath=true;
            this.isFromWidget=false;
            return;
          }
        },
        (state: DbQueriesLoadingErrorState) => {
          me.onLoadingError(state);
        }
      );
    }
  }

  private onLoading(state: DbQueriesLoadingState) {
    const me = this;
    me.error = null;
    me.empty = null;
    // me.data = null;
    me.loading = true;
  }

  private onLoadingError(state: DbQueriesLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: DbQueriesLoadedState) {
    const me = this;
    me.data = state.data.panels[0];
    me.restgrphdata = me.data.restData;
    me.error = null;
    me.loading = false;

    if (me.data) {
      me.empty = false;
      if(!me.data.data || me.data.data == null ||  me.data.data.length == 0){
        me.emptyTable = true;
      }
      let check = {}
      me.dbQueriesData = me.data.data ;
      // me.loadPagination(check);
      this.totalRecords = this.data.data.length;

    } else {
      me.empty = true;
    }
    me.cols = me.data.headers[0].cols;
    me._selectedColumns =[];
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    for (let i=0; i<me.data.data.length; i++){
        this.totalQueryCount+=Number(me.data.data[i]['count']);
	if(i == 0){
          this.queryName = me.data.data[i]['sqlquery'] || me.data.data[i]['sqlQuery'];
         }
    }

    if( me.data.data.length > me.data.paginator.rows){
      me.showPagination = true;
    }
 
  }

  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;
    if (typeof rowA[field] === 'string') {
      return rowA[field].localeCompare(rowB[field]);
    }
    if (typeof rowA[field] === 'number') {
      if (rowA[field] > rowB[field]) return 1;
      else return -1;
    }
  }

  filterField(row, filter) {
    let isInFilter = false;
    let noFilter = true;
    for (var columnName in filter) {
      if (row[columnName] == null) {
        return;
      }
      noFilter = false;
      let rowValue: String = row[columnName].toString().toLowerCase();
      let filterMatchMode: String = filter[columnName].matchMode;
      if (
        filterMatchMode.includes('contain') &&
        rowValue.includes(filter[columnName].value.toLowerCase())
      ) {
        isInFilter = true;
      } else if (
        filterMatchMode.includes('custom') &&
        rowValue.includes(filter[columnName].value)
      ) {
        isInFilter = true;
      }
    }
    if (noFilter) {
      isInFilter = true;
    }
    return isInFilter;
  }

  loadPagination(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.data) {
        // this.dbQueriesData = this.dbQueryDataTemp.slice(
        //   event.first,
        //   event.first + event.rows
        // );
        this.dbQueryDataTemp = this.data.data.filter((row) =>
        this.filterField(row, event.filters)
      );
      this.dbQueryDataTemp.sort(
        (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
      );
      this.dbQueriesData = this.dbQueryDataTemp;
      // this.dbQueriesData = this.dbQueryDataTemp.slice(
      //   event.first,
      //   event.first + event.rows
      // );
        this.loading = false;
      }
    }, 1000);
  }

  openFlowpath(RowData){
    const me = this;
    console.log("db row data ---",RowData);
    me.sessionService.setSetting("dbRowData",RowData);
    this.router.navigate(['/drilldown/flow-path'], { queryParams: {state: me.stateID}});
  }

  openExceptionReport(RowData){
    const me = this;
    me.sessionService.setSetting("dbRowData",RowData);
    this.router.navigate(['/dashboard-service-req/exception'], { queryParams: {state: me.stateID}});
  }

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

  showRowInfo(RowData){
    this.queryName = RowData.sqlquery || RowData.sqlQuery;
  }

  @Input() get selectedColumns(): DbQueriesTableHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: DbQueriesTableHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  ngOnDestroy() {
    this.subscribeDbQuery.unsubscribe();
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = JSON.parse(JSON.stringify(this.dbQueriesData));
    let header = [];
    let rowData:any []=[];
    header.push("S No.");
    if(this.isFromWidget === true)
    {
      for (const c of me.data.headers[0].cols)
      header.push(c.label);
      for(let i =0;i<tableData.length;i++)
      {
        let rData:string []=[];
        let number = i+1;
          rData.push(number.toString());
          rData.push(tableData[i].sqlQuery);
          // rData.push(tableData[i].sqlbegintimestamp);
          // rData.push(tableData[i].sqlendtimestamp);
          rData.push(tableData[i].count);
          rData.push(tableData[i].failedcount);
          rData.push(tableData[i].min);
          rData.push(tableData[i].max);
          rData.push(tableData[i].mincumsqlexectime);
          rData.push(tableData[i].maxcumsqlexectime);
          rData.push(tableData[i].avg);
          rData.push(tableData[i].tierName);
          // rData.push(tableData[i].cumsqlexectime);
          // rData.push(tableData[i].sqlindex);

        rowData.push(rData);
      }
    }
    if(this.isFromFlowPath === true)
    {
      for (const c of me.data.headers[0].cols)
      header.push(c.label);
      for(let i =0;i<tableData.length;i++)
      {
        let rData:string []=[];
        let number = i+1;
          rData.push(number.toString());
          rData.push(tableData[i].sqlquery);
          rData.push(tableData[i].sqlbegintimestamp);
          rData.push(tableData[i].sqlendtimestamp);
          rData.push(tableData[i].count);
          rData.push(tableData[i].failedcount);
          rData.push(tableData[i].mincumsqlexectime);
          rData.push(tableData[i].maxcumsqlexectime);
          rData.push(tableData[i].avg);
          rData.push(tableData[i].cumsqlexectime);
          rData.push(tableData[i].sqlindex);

        rowData.push(rData);
      }
    }

    try {
      me.dbQueriesService.downloadShowDescReports(label, rowData,header).subscribe(
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
      console.log("Exception in downloadShowDescReports method in DB Query report component :", err);
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

  clickHandler(event) {
    const me = this;
    me.refreshTable = true;
    console.log("inside click handler -- event -- ", event);
    let filteredData = [];
    if(event.point != undefined  ) { 
      if (event.point.name == "Other") {
        me.dbQueriesData = me.restgrphdata['dbchart'];
      } else {
        me.data.data.forEach((val, index)=>{
          if (val["sqlQuery"] == event.point.name || val["sqlquery"] == event.point.name) {
              filteredData.push(val);
          }
        });
      }
      if(filteredData.length>0){
        me.dbQueriesData = filteredData;
      }
      me.showRowInfo(me.dbQueriesData[0]);
    }
  }

  refreshData(){
    const me = this;
    me.dbQueriesData = me.data.data;
    me.refreshTable = false;
    me.showRowInfo(me.dbQueriesData[0]);
  }

}
