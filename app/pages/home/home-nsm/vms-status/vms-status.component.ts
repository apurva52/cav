import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Table, TableHeaderColumn } from '../../../../shared/table/table.model';
import { vms_NAME_DATA } from './vms.dummy';
import { MenuItem } from 'primeng'; 
import { NsmhttpservicesService } from './../nsmhttpservices.service';
import { dataFortable} from './vms.model';
@Component({
  selector: 'app-vms-status',
  templateUrl: './vms-status.component.html',
  styleUrls: ['./vms-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VMsStatusComponent implements OnInit {
  downloadOptions: MenuItem[];
  data: any;
  totalRecords = 0;
  error: string;
  loading: boolean = false;
  empty: boolean;


  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  constructor(private http:NsmhttpservicesService) { }

  ngOnInit(){ 
    const me = this;
    me.downloadOptions = [{ label: "export CSV" },
    { label: "export PDF" },
    { label: "export XLS" }];



    me.data = vms_NAME_DATA;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    } 
    this.getForTabledata();
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
  getForTabledata() { 
    this.loading = true;
    let vm = "vm";

    this.http.getActionLogs(vm).subscribe((data) => {
      let response
      response = <any[]>data; 
      this.loading = false;
      
      if (response != null && response != undefined) {
        this.data.data = []
        for (let k of response.data) {
          let obj = {} as dataFortable
          let split = k.split('|');
          obj.sl = split[0]
          obj.servername = split[1]
          obj.serverip = split[2]
          obj.vender = split[3]
          obj.status = split[4]
          obj.Uptime = split[5]
          obj.Downtime = split[6]
          obj.duration = split[7]
          this.data.data.push(obj)

        }
      }
     this.empty=!this.data.data.length;

    })
  }
}
