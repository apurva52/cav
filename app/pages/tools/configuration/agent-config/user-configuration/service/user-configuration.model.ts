import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface UserConfigTable extends Table {
  agentSetting?: Table;
  ndcSetting?: Table;
}