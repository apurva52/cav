import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { PROFILE_TABLE_DATA } from './service/profile.dummy';
import { profileHeaderCols, profileTable, profileTableHeader } from './service/profile.model';
import { ProfileNameDetailsComponent } from './profile-name-details/profile-name-details.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  data: profileTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: profileHeaderCols[] = [];
  _selectedColumns: profileHeaderCols[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;
  
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  isOn: boolean = true;
  @Output() rowClick = new EventEmitter<boolean>();
  
  constructor(
    private router : Router
  ) {}

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ];

    me.data = PROFILE_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): profileHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: profileHeaderCols[]) {
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
  showProfile(columnName){
    if (columnName === 'Name') {
      this.isOn = false;
      this.rowClick.emit(this.isOn)
    }
  }

  serviceMethodTiming($event) {
    this.isOn = $event;
  }
  
  hotspotSummary($event) {
    this.isOn = $event;
  }
}
