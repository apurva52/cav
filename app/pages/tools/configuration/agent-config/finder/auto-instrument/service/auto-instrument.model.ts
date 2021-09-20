import { Table } from "src/app/shared/table/table.model";

export interface AutoInstrumentTable extends Table {
    activeInstrumentationTable?: Table;
    autoInstrumentationTable?: Table;    
    iconsField?: any;
  }