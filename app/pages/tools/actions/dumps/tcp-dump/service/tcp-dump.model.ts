import { SelectItem } from 'primeng';
import { Table } from 'src/app/shared/table/table.model';

export interface TcpDumpData {
  dropDownOptions?: DropdownOptions;
  tcpData?: Table;
}
export interface DropdownOptions {
  tireName?: SelectItem[];
  serverName?: SelectItem[];
  interface?: SelectItem[];
  maxDuration?: SelectItem[];
  size?: SelectItem[];
}
