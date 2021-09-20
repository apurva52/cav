import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { MACHINEAGENT_TABLE } from './service/machine-agent.dummy';
import { MachineAgentHeaderCols, MachineAgentTable } from './service/machine-agent.model';

@Component({
  selector: 'app-machine-agent',
  templateUrl: './machine-agent.component.html',
  styleUrls: ['./machine-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MachineAgentComponent implements OnInit {

  data: MachineAgentTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  
  cols: MachineAgentHeaderCols[] = [];
  _selectedColumns: MachineAgentHeaderCols[] = [];
  globalFilterFields: string[] = [];
  
  downloadOptions: MenuItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  
  constructor(private router : Router) { }

  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD'},
      { label: 'PDF'},
      { label: 'EXCEL'}
    ]
    
    me.data = MACHINEAGENT_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
    @Input() get selectedColumns(): MachineAgentHeaderCols[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: MachineAgentHeaderCols[]) {
      const me = this;
      me._selectedColumns = me.cols.filter((col) => val.includes(col));
    }

    restart(){
      
    }

    refresh(){
      
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
