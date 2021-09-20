import { SelectItem } from 'primeng';
import { Table } from 'src/app/shared/table/table.model';

export interface NewCommand {
  dropDownOptions?: DropdownOptions;
  commandDetails?: CommandDetails;
}
export interface DropdownOptions {
  tireName?: SelectItem[];
  serverName?: SelectItem[];
  groupName?: SelectItem[];
  commandName?: SelectItem[];
  filterOptions?: SelectItem[];
  viewType?: SelectItem[];
  deliMeter?: SelectItem[];
}

export interface CommandDetails {
  commandReportList?: any[];
  commandData?: Table;
  serverName?: string;
  commandName?: string;
  serverTime?: string;
}
