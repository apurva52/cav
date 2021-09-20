import { Component, Input, OnInit, ViewChild } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../shared/table/table.model';
import { Projectallocation_NAME_DATA } from './project-allocation.dummy';
import { MenuItem, Table } from 'primeng';

@Component({
  selector: 'app-project-allocation',
  templateUrl: './project-allocation.component.html',
  styleUrls: ['./project-allocation.component.scss']
})
export class ProjectAllocationComponent implements OnInit {
  @ViewChild('servers') servers: Table;
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  lat = 13;
  lng = 80;
  totalRecordspivot = 0;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  Commands: any;
  selectedComand: any; 
  columns:any; 
  allocation:any; 
  freedata:[]; 
  ASbladedata:[];
  constructor() { 
    this.columns = [
      { header: 'Select', field: 'Name' },
      { header: 'Sl No', field: 'Description' },
      { header: 'Server Name', field: 'Channel' },
      { header: 'Server Ip', field: 'User Segment' },
      { header: 'Blade Name', field: 'Last Modified' },
      { header: 'Ubuntu', field: 'Last Modified' },
      { header: 'Type', field: 'Last Modified' },
      { header: 'Status', field: 'Last Modified' },
      { header: 'Allocation', field: 'Last Modified' },
      { header: 'Build Version', field: 'Last Modified' },
      { header: 'Upgradation Date', field: 'Last Modified' },
      { header: 'Test whitelist', field: 'Last Modified' },
      // { field: 'checkoutfunnelflag', header: 'Checkout BP', classes: 'text-right' }

    ]; 
    this.allocation=[
      { header: 'Select', field: 'Name' },
      { header: 'Sl No', field: 'Description' },
      { header: 'Server Name', field: 'Channel' },
      { header: 'Server Ip', field: 'User Segment' },
      { header: 'Blade Name', field: 'Last Modified' },
      { header: 'Ubuntu', field: 'Last Modified' },
      { header: 'Type', field: 'Last Modified' },
      { header: 'Status', field: 'Last Modified' },
      { header: 'Allocation', field: 'Last Modified' },
      { header: 'Build Version', field: 'Last Modified' },
      { header: 'Upgradation Date', field: 'Last Modified' },
      { header: 'Test whitelist', field: 'Last Modified' },
    ]
   }

  ngOnInit(): void {  
    const me = this;
    me.data = Projectallocation_NAME_DATA;
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
