import { TableHeaderColumn, Table } from 'src/app/shared/table/table.model';

export interface PeripheralDeviceHeaderCols extends TableHeaderColumn {
}

export interface PeripheralDeviceTableHeader {
  cols: PeripheralDeviceHeaderCols[];
}

export interface PeripheralDeviceTable extends Table {
  headers?:  PeripheralDeviceTableHeader[];
  iconsField?: any;
}



