import {
  TableHeaderColumn,
  Table,
} from 'src/app/shared/table/table.model';

export interface MethodCallDetailsTableHeaderCols extends TableHeaderColumn {
  severityColorField?: boolean;
}

export interface TableHeader {
  cols: MethodCallDetailsTableHeaderCols[];
}

export interface MethodCallDetailsData {
  treeTable: MethodCallDetailsTable;
  dataTable: MethosCallDetailDataTable;
  repeatMethodsData:MethosCallDetailDataTable;
  repeatedCalloutTable:MethosCallDetailDataTable;
  totalQueueTime: string;
  totalSelfTime:  string;
  }

export interface MethodCallDetailsTable extends Table {
  headers?: TableHeader[];
  legend?: MethodCallDetailsLegends[];
  packages?: MethodCallDetailsFilterPackage[];
  classes?: MethodCallDetailsFilterClasses[];
  methods?: MethodCallDetailsFilterMethods[];
  severityBgColorField?: string;
  downloaddata?:any[];
  uniqueMethods?:string[];
}
export interface MethosCallDetailDataTable extends Table {
  headers?: TableHeader[];
  fpsInfo?:Map<string,string[]>;
}
export interface MethodCallDetailsFilterPackage {
  label: string;
  value: string;
}

export interface MethodCallDetailsFilterClasses {
  label: string;
  value: string;
}

export interface MethodCallDetailsFilterMethods {
  label: string;
  value: string;
}

export interface MethodCallDetailsLegends {
  name?: string;
  key?: string;
  color?: string;
  selected?: boolean;
  showInLegend?: boolean;
}

export interface MethodCallDetailsTableLoadPayload {
  legend?: MethodCallDetailsLegends[];
}

export interface MethodCallDetailsMultiselct{
  packages?: MethodCallDetailsFilterPackage[];
  classes?: MethodCallDetailsFilterClasses[];
  methods?: MethodCallDetailsFilterMethods[];
}

