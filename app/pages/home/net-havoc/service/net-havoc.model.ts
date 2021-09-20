import { ChartConfig } from 'src/app/shared/chart/service/chart.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';


export interface netHavocTable extends Table{ 
	havocStates?: any;
	scnarioStates?: any;
  borderColor?: any;
  toggleField?: boolean;
  havocDistribution?: any;
  charts: ChartConfig[];
  targetDetails: Table;
}


