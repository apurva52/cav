import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng';
import { FilterUtils } from 'primeng/utils';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MethodTimingComponent } from '../method-timing.component';
import { ServiceMethodTimingData } from './service/service-method-timing.model';
import { ServiceMethodTimingService } from './service/service-method-timing.service';
import {
  ServiceMethodTimingLoadedState,
  ServiceMethodTimingLoadingErrorState,
  ServiceMethodTimingLoadingState,
  DownloadReportLoadingState,
  DownloadReportLoadingErrorState,
  DownloadReportLoadedState
} from './service/service-method-timing.state';
import { SERVICE_METHOD_TIMING_DATA } from './service/service-method-timing.dummy';
import { ServiceMethodTimingParams } from '../service/method-timing.model';


@Component({
  selector: 'app-service-method-timing',
  templateUrl: './service-method-timing.component.html',
  styleUrls: ['./service-method-timing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceMethodTimingComponent implements OnInit {
  data: ServiceMethodTimingData;
  error: AppError;
  loading: boolean;
  empty: boolean;
  menu: MenuItem[];
  inputValue: any;
  newData: ServiceMethodTimingData = SERVICE_METHOD_TIMING_DATA;
  isShow: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  qtd: any[] = [];

  isCheckbox: boolean;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  finalValue: boolean;
  isOn: boolean = true;
  isShowSearch: boolean;
  

  totalRecords: any;
  downloadOptions: MenuItem[];
  serviceMTDataTemp: any[];
  servicemethodtimingData: any[];
  // updatedMTdata: any;
  showPagination: boolean = false;
  
  @Input('serviceMethodparams') serviceMethodparams: ServiceMethodTimingParams;
  @Output() arrowClick = new EventEmitter<boolean>();

  @ViewChild("serviceMethodTiming") flowpath: ElementRef;
  globalFilterFields: string[] = [];

  @ViewChild('searchInput', { read: ElementRef, static: false })
  searchInput: ElementRef;

  constructor(private serviceMethodTimingService: ServiceMethodTimingService) { }

  ngOnInit() {
    const me = this;
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

    me.menu = [
      {
        label: 'Merge Stack Trace',
      },
    ];
  }

  load() {
    const me = this;
    me.serviceMethodTimingService.serviceMTParams = me.serviceMethodparams;
    me.serviceMethodTimingService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof ServiceMethodTimingLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof ServiceMethodTimingLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: ServiceMethodTimingLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: ServiceMethodTimingLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  loadPagination(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.data.smtData.data) {
        this.serviceMTDataTemp = this.data.smtData.data.filter((row) =>
          this.filterField(row, event.filters)
        );
        this.serviceMTDataTemp.sort(
          (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
        );
        this.servicemethodtimingData = this.serviceMTDataTemp;
        // this.servicemethodtimingData = this.serviceMTDataTemp.slice(
        //   event.first,
        //   event.first + event.rows
        // );
        this.loading = false;
      }
    }, 1000);
  }

  clearFilters() {
    const me = this;
    me.inputValue = document.querySelector('.search-box');
    me.inputValue.value = '';
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

  sortField(rowA, rowB, field: string): number {
    if (rowA[field] == null) return 1;

    if (field == "avgCPUTime" || field == "avgSelfTime" || field == "cumCPUTime" || field == "cumSelfTime" || field == "executionTime" || field == "iotime" || field == "suspensiontime" || field == "syncTime") {
      if (parseFloat(rowA[field]) > parseFloat(rowB[field])) return 1;
      else return -1;
    }
    else {
      return rowA[field].localeCompare(rowB[field]);
    }
  }



  private onLoadingError(state: ServiceMethodTimingLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: ServiceMethodTimingLoadedState) {
    const me = this;
    me.data = state.data;
    console.log("me.data ", me.data);
    me.error = null;
    me.loading = false;
    if (me.data) {
      //this.updatedMTdata = this.doHyperLinkOnMethod(this.data.panels[0].data);
      let check = {}
      me.loadPagination(check);
      me.totalRecords = this.data.smtData.data.length;
      me.empty = false;
    } else {
      me.empty = true;
    }

    //const me = this;
    //me.data = state.data;
    //me.data = me.newData;
    // me.error = null;
    // me.loading = false;
    // console.log('Data : ', me.data);

    me.cols = me.data.smtData.headers[0].cols;
    for (const c of me.data.smtData.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    if( me.data.smtData.data.length > me.data.smtData.paginator.rows){
      me.showPagination = true;
    }
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

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  hotspotSummary($event) {
    this.isOn = $event;
  }
  downloadShowDescReports(label) {
    const me = this;
    let tableData = me.data.smtData.data;
    let header = [];
    header.push("S No.");
    
    for (const c of me.data.smtData.headers[0].cols)
        header.push(c.label);

    try {
      me.serviceMethodTimingService.downloadShowDescReports(label, tableData,header).subscribe(
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
      console.log("Exception in downloadShowDescReports method in Service method timing component :", err);
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

  backToMethodTiming() {
    //alert(this.isOn);
    this.isOn = false;
    this.arrowClick.emit(this.isOn);

  }
}
