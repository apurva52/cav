import { Table } from 'src/app/shared/table/table.model';

export interface ServiceMethodTimingData {
  smtData?: ServiceMethodTimingPanelData;
}

export interface ServiceMethodTimingPanelData extends Table {
  rowBgColorField?: string;
  severityBgColorField?: string;
}

