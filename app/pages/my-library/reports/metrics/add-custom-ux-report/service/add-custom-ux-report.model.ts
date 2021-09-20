import { MenuItem, SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';

// export interface ScheduleReportData {
//     ScheduleReportMenuOptions?: ScheduleReportDataPanel;
// }

export interface AddCustomUxReportData {
    reportGroup?: SelectItem[];
    dataFields?: SelectItem[];
    dimensions?: SelectItem[];
    dimensionDropdown?: SelectItem[];
}