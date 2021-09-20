import { MenuItem, SelectItem } from 'primeng';
import { TableHeader } from 'src/app/shared/table/table.model';

export interface IndicesData {
    storeTier?: SelectItem[];
    server?: SelectItem[];
    dropDown?: SelectItem[];
    instance?: SelectItem[];
    indices?: SelectItem[];
}