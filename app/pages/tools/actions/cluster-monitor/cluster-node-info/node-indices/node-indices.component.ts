import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { IndicesClearCacheComponent } from '../../dialogs/indices-clear-cache/indices-clear-cache.component';
import { IndicesFlushComponent } from '../../dialogs/indices-flush/indices-flush.component';
import { IndicesOptimizeComponent } from '../../dialogs/indices-optimize/indices-optimize.component';
import { IndicesRefreshComponent } from '../../dialogs/indices-refresh/indices-refresh.component';
import { INDICES_DATA } from './service/node-indices.dummy';
import { NodeIndicesData } from './service/node-indices.model';

@Component({
  selector: 'app-node-indices',
  templateUrl: './node-indices.component.html',
  styleUrls: ['./node-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeIndicesComponent implements OnInit {
  data: NodeIndicesData;
  isShowColumnFilter: boolean;
  error: boolean;
  emptyTable: boolean;
  loading: boolean;
  nodeStatus: SelectItem[];
  downloadOptions: MenuItem[];
  globalFilterFields: string[] = [];

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  @ViewChild(IndicesFlushComponent, {
    read: IndicesFlushComponent,
  })
  private indicesFlushComponent: IndicesFlushComponent;

  @ViewChild(IndicesRefreshComponent, {
    read: IndicesRefreshComponent,
  })
  private indicesRefreshComponent: IndicesRefreshComponent;

  @ViewChild(IndicesOptimizeComponent, {
    read: IndicesOptimizeComponent,
  })
  private indicesOptimizeComponent: IndicesOptimizeComponent;

  @ViewChild(IndicesClearCacheComponent, {
    read: IndicesClearCacheComponent,
  })
  private indicesClearCacheComponent: IndicesClearCacheComponent;

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = INDICES_DATA;
    me.nodeStatus = [
      {
        label: 'Open',
        value: 'open',
      },
      {
        label: 'Close',
        value: 'close',
      },
    ];
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.cols = me.data.indicesData.headers[0].cols;
    for (const c of me.data.indicesData.headers[0].cols) {
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

  openFlushDialog() {
    const me = this;
    me.indicesFlushComponent.show();
  }

  openRefreshDialog() {
    const me = this;
    me.indicesRefreshComponent.show();
  }

  openOptimizeDialog() {
    const me = this;
    me.indicesOptimizeComponent.show();
  }

  openCacheDialog() {
    const me = this;
    me.indicesClearCacheComponent.show();
  }
}
