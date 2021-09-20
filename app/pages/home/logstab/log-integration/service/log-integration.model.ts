import { SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';

export interface LogIntegrationData {
    pattern?: SelectItem[];
    headers?: TableHeader[];
    data: any;
    fields?: any[];
}