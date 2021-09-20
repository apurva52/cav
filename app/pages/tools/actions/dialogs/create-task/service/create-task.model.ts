import { SelectItem } from 'primeng';

export interface CreateTask {
  preset?: SelectItem[];
  days?: SelectItem[];
  hourlyType?: SelectItem[];
  template?: SelectItem[];
  viewBy?: SelectItem[];
  value?: SelectItem[];
  reportType?: SelectItem[];
  matrics?: SelectItem[];
}
