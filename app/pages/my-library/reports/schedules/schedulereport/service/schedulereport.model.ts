import { Moment } from 'moment-timezone';
import { MenuItem, SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';

// export interface ScheduleReportData {
//     ScheduleReportMenuOptions?: ScheduleReportDataPanel;
// }

export interface ScheduleReportData {
    preset?: SelectItem[];
    days? : SelectItem[];
    hourlyType? : SelectItem[];
    template?: SelectItem[];
    viewBy?: SelectItem[];
    value?: SelectItem[];
    reportType?: SelectItem[];
    matrics?: SelectItem[];
}
export interface TempFavList {
    Template:  TempFavList[];
  }
export interface MailObj {
    subject?: String;
    to?: String;
    body?: String;
}
export interface CrqObj {
    lastTime?: string;
    readFromTemplate?: boolean;
    shwLstData?: boolean;
    reportView?: string;
    numAddGraphImageInSchMailBody?: string;
    isMultiDC?: boolean;
    aggEntireRpt?: string;
    includeChart?: boolean;
    userName?: string;
    productKey?: string;
    testRun?: string;
    viewBy?: string;
    addOSInPreTime?: boolean;
    isDiscontinue?: boolean;
    boundaryCondition?: string; 
    templateName?: string;
    metricOption?: number; 
    name?: string;
    addGraphImageInSchMailBody?: boolean;
    multiDCPort?: string;
    format?: string;
    startDate?:string;
    endDate?:string;
    startTime?:string;
    endTime?: string;
    cck?: string;
    prodType?: string;
    eventDay?: string;
    eventYear?: string;
    offSetValue?: string;
}
export interface SchObj {
    taskId?: number;
    cronStr?: string;
    taskType?: string;
    expiryTime?: string;
    schTime?: string;
    scheduled?: boolean;
    status?: string;
    taskDes?: string;
    lastModified?: number;
}
 