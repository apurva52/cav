import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface NdautoinjectTable extends Table {
  PolicyRule?: Table;
  InjectionConfig?: Table;
  iconField?: any;
}