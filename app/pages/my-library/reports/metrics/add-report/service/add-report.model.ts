import { MenuItem, SelectItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AppError } from 'src/app/core/error/error.model';
import { AppMenuItem } from 'src/app/shared/menu-item/service/menu-item.model';

// export interface AddReportData {
//     addReportMenuOptions?: AddReportDataPanel;
// }

export interface AddReportData extends Table{
      severityBgColorField?: string;
      iconsField?: any;
    preset?: SelectItem[];
    viewBy?: SelectItem[];
    value?: SelectItem[];
    reportType?: SelectItem[];
    matrics?: SelectItem[];
    filter?: SelectItem[];
    dropDownFilterValue?:SelectItem[];
    dropDownInclude?:SelectItem[];
}

// export interface MeasurementTableHeaderCols extends TableHeaderColumn {
//     severityColorField?: boolean;
//   }
  
//   export interface MeasurementTableHeader {
//     cols: MeasurementTableHeaderCols[];
//   }
  
//   export interface MeasurementTable extends Table {
//     headers?: MeasurementTableHeader[];
//     severityBgColorField?: string;
//     iconsField?: any;
//   }



// ----------------------for preset option ----------------------changes
export interface GlobalReportTimebarResponse {
    timePeriod: TimebarMenuConfig;
    viewBy: TimebarMenuConfig;
    time: TimebarTimeConfig;
    running: boolean;
    discontinued: boolean;
    includeCurrent: boolean;
}

export interface GlobalTimebarResponse {
    viewBy?: Array<AppMenuItem>;
    bestViewBy?: Array<AppMenuItem>;
    timePeriod?: Array<AppMenuItem>;
    error?: AppError;
    running?: boolean;
    selectedPreset?: string;
    selectedViewBy?: string;
    times?: number[];
}



export interface TimebarValue {
    timePeriod: TimebarMenuConfig;
    viewBy: TimebarMenuConfig;
    time: TimebarTimeConfig;
    running: boolean;
    discontinued: boolean;
    includeCurrent: boolean;
}

export interface TimebarValueInput {
    timePeriod?: string;
    viewBy?: string;
    running?: boolean;
    discontinued?: boolean;
    includeCurrent?: boolean;
    updateTime?: boolean;
}


export interface TimeMarker {
    label: string;
    value: number;
    position: string;
}
export interface AlertMarker {
    label: string;
    value: number;
    position: string;
}

export interface TimebarValue {
    timePeriod: TimebarMenuConfig,
    viewBy: TimebarMenuConfig
}

export interface TimebarTimeFrameTimeConfig {
    raw: string;
    value: number;
}

export interface TimebarTimeConfig {
    min: TimebarTimeFrameTimeConfig;
    max: TimebarTimeFrameTimeConfig;
    frameStart: TimebarTimeFrameTimeConfig;
    frameEnd: TimebarTimeFrameTimeConfig;
}

export interface TimebarMenuConfig {
    selected: MenuItem;
    previous: MenuItem;
    options: MenuItem[];
}

export interface Measurement{
  name?:string,
  preset?: string,
  presetlabel?:string,
  start?: any,
  end?: any,
  icon?: any,
  rowBgColorField?: any
}