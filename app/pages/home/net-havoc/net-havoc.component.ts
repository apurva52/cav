import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { NET_HAVOC_DATA } from './service/net-havoc.dummy';
import { netHavocTable } from './service/net-havoc.model';

@Component({
  selector: 'app-net-havoc',
  templateUrl: './net-havoc.component.html',
  styleUrls: ['./net-havoc.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NetHavocComponent implements OnInit {
  data: netHavocTable;
  analyticsMode: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = NET_HAVOC_DATA;
    me.cols = me.data.targetDetails.headers[0].cols;
    for (const c of me.data.targetDetails.headers[0].cols) {
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
