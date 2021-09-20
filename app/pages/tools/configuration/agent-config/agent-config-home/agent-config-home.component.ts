import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AGENT_HOME_TABLE_DATA } from './service/agent-config-home.dummy';
import { agentHomeTable } from './service/agent-config-home.model';

@Component({
  selector: 'app-agent-config-home',
  templateUrl: './agent-config-home.component.html',
  styleUrls: ['./agent-config-home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgentConfigHomeComponent implements OnInit {
  data: agentHomeTable;
  cols: TableHeaderColumn[] = [];
  statCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = AGENT_HOME_TABLE_DATA;
    
  }

}
