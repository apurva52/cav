import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { NET_HAVOC_REPORT_TABLE } from './service/havoc-report.dummy';
import { HavocReportData, HavocReportHeaderCols } from './service/havoc-report.model';

@Component({
  selector: 'app-net-havoc-report',
  templateUrl: './net-havoc-report.component.html',
  styleUrls: ['./net-havoc-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NetHavocReportComponent implements OnInit {

  breadcrumb: MenuItem[];
  data: HavocReportData;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  empty: boolean;
  cols: HavocReportHeaderCols[] = [];
  _selectedColumns: HavocReportHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  selectedNodes: TreeNode[] = [];
  selectedOption: string;
  isShow: boolean = true;
  responsiveOptions;

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
    const me = this;

    me.breadcrumb = [
      {label: 'Home'},
      {label: 'Net-havoc'},
      {label: 'Net-havoc-report'}
    ];
    me.downloadOptions = [
      {label: 'WORD'},
      {label: 'PDF'},
      {label: 'EXCEL'}
    ];

    me.data = NET_HAVOC_REPORT_TABLE;

    me.cols = me.data.havocReportTable.headers[0].cols;
    for (const c of me.data.havocReportTable.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): HavocReportHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: HavocReportHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  goBack(){
    const me = this;
    me.location.back();
  }

  closeSidePanel(){
    const me = this;
    me.isShow = false;
  }
  openSidePanel() {
    const me = this;
    me.isShow = true;
  }

}
