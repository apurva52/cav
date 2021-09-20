import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface CommandListTable extends Table {
  agentSetting?: Table;
  ndcSetting?: Table;
}