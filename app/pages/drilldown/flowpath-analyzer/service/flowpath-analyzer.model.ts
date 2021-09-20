import { Table, TableHeader, TablePagination, TableSearch, TableSort } from 'src/app/shared/table/table.model';
import { ChartConfig } from 'src/app/shared/chart/service/chart.model';


export interface FlowpathAnalyzerData{
    panels: FlowpathAnalyzerPanel[];
}

export interface FlowpathAnalyzerPanel extends Table{
    label: string;
    headers: TableHeader[];
    collapsed?: boolean;
    searchOption?: boolean;
    menuOption?: boolean;
    readField?: string;
    rowBgColorField?: string;
    severityBgColorField?: string;
    urlsField?: string;
    iconsField?: any;
    charts?: ChartConfig[];
    avgData?:any;
}

