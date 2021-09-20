import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { QUERY_DATA } from './service/node-query.dummy';
import { NodeQueryData } from './service/node-query.model';

@Component({
  selector: 'app-node-query',
  templateUrl: './node-query.component.html',
  styleUrls: ['./node-query.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeQueryComponent implements OnInit {
  data: NodeQueryData;
  isShowColumnFilter: boolean;
  error: boolean;
  emptyTable: boolean;
  loading: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];
    me.data = QUERY_DATA;
    me.cols = me.data.queryData.headers[0].cols;
    for (const c of me.data.queryData.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
}
