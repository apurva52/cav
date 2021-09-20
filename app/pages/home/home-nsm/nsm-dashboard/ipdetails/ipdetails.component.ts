import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { TableHeaderColumn } from '../../../../../shared/table/table.model';
import { IPDETAILS_NAME_DATA } from './ipdetails.dummy';
import { MenuItem, Table } from 'primeng';

@Component({
  selector: 'app-ipdetails',
  templateUrl: './ipdetails.component.html',
  styleUrls: ['./ipdetails.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IpdetailsComponent implements OnInit { 
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
  Commands:any; 
  selectedComand:any;

  constructor() { }

  ngOnInit() { 
    const me = this; 
    me.Commands = [
      { label: 'df', value: null },
      { label: 'CPU', value: null },
      { label: 'Postgres', value: null },
      { label: 'tomcat', value: null },
      { label: 'top', value: null },
      { label: 'ifconfig', value: null },
      { label: 'Free Memory', value: null },
    ] 






    me.data = IPDETAILS_NAME_DATA;
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
