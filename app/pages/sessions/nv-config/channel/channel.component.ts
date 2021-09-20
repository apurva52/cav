import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { CHANNEL_TABLE } from './service/channel.dummy'; 
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChannelComponent extends PageDialogComponent implements OnInit {
  data: Table;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;

  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = []; 
  buttonflag: boolean = false;
  
  constructor(private router: Router, private SessionStateService: SessionStateService ) {
    super();
  }
  show() {
    super.show();
  }
  ngOnInit(): void {
    const me = this; 
    if (this.SessionStateService.isAdminUser() == true) {
      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {
      this.buttonflag = false;

    }
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]

    me.data = CHANNEL_TABLE;
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

    showAddReport(){
      this.router.navigate(['/add-report']);
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
