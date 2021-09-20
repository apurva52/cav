import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { APPLICATIONAGENT_TABLE } from './service/application-agent.dummy';
import { ApplicationAgentHeaderCols, ApplicationAgentTable } from './service/application-agent.model';

@Component({
  selector: 'app-application-agent',
  templateUrl: './application-agent.component.html',
  styleUrls: ['./application-agent.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationAgentComponent implements OnInit {

  data: ApplicationAgentTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  isCheckbox: boolean;
  
  cols: ApplicationAgentHeaderCols[] = [];
  _selectedColumns: ApplicationAgentHeaderCols[] = [];
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
    
    me.data = APPLICATIONAGENT_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
    @Input() get selectedColumns(): ApplicationAgentHeaderCols[] {
      const me = this;
      return me._selectedColumns;
    }
    set selectedColumns(val: ApplicationAgentHeaderCols[]) {
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
