import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MAPPING_DATA } from './service/node-mapping.dummy';
import { NodeMappingData } from './service/node-mapping.model';

@Component({
  selector: 'app-node-mapping',
  templateUrl: './node-mapping.component.html',
  styleUrls: ['./node-mapping.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeMappingComponent implements OnInit {
  data: NodeMappingData;
  isShowColumnFilter: boolean;
  isShowMapTypeColumnFilter: boolean;
  error: boolean;
  emptyTable: boolean;
  loading: boolean;
  downloadOptions: MenuItem[];

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  mapTypeCols: TableHeaderColumn[] = [];
  mapTypeSelectedColumns: TableHeaderColumn[] = [];
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];
    me.data = MAPPING_DATA;
    me.cols = me.data.mapInfoData.headers[0].cols;
    for (const c of me.data.mapInfoData.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.mapTypeCols = me.data.mapTypeData.headers[0].cols;
    for (const c of me.data.mapTypeData.headers[0].cols) {
      if (c.selected) {
        me.mapTypeSelectedColumns.push(c);
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

  @Input() get selectedMapTypeColumns(): TableHeaderColumn[] {
    const me = this;
    return me.mapTypeSelectedColumns;
  }

  set selectedMapTypeColumns(val: TableHeaderColumn[]) {
    const me = this;
    me.mapTypeSelectedColumns = me.cols.filter((col) => val.includes(col));
  }
}
