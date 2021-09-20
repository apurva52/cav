import { TableHeader } from 'src/app/shared/table/table.model';

export interface ProjectPanelData {
    panels: ProjectDataPanel[];
}

export interface ProjectDataPanel{
    label: string;
    headers: TableHeader[];
    data?: any[];
}