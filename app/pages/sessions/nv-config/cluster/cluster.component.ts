import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CLUSTER_DATA } from './service/cluster.dummy';
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClusterComponent implements OnInit {

  data: Table;
  totalRecords = 0;
  error: AppError;
  loading: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  buttonflag: boolean = false;


  constructor(private SessionStateService: SessionStateService) { }

  ngOnInit(): void {
    if (this.SessionStateService.isAdminUser() == true) {

      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {

      this.buttonflag = false;

    }

    const me = this;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.data = CLUSTER_DATA;
    this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
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
