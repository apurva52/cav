import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { SHARDS_DATA } from './service/shards.dummy';
import { ShardsData } from './service/shards.model';

@Component({
  selector: 'app-indices-shards',
  templateUrl: './indices-shards.component.html',
  styleUrls: ['./indices-shards.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IndicesShardsComponent implements OnInit {
  data: ShardsData;
  isShowColumnFilter: boolean;
  error: boolean;
  emptyTable: boolean;
  loading: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = SHARDS_DATA;
    me.cols = me.data.shardData.headers[0].cols;
    for (const c of me.data.shardData.headers[0].cols) {
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
