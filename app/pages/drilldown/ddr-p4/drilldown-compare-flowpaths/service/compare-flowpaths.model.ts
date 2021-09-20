import { TableHeader } from 'src/app/shared/table/table.model';

export interface CompareFlowPathData {
    comparefp: CompareFlowpathDataPanel[];
}

export interface CompareFlowpathDataPanel{
    label: string;
    headers: TableHeader[];
    data?: any[];
}