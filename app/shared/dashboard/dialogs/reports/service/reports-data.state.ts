import { Store } from 'src/app/core/store/store';
import { SelectItem } from 'primeng';

export class ReportTypeLoadedState extends Store.AbstractIdealState<SelectItem[]> { }

export class ViewTypeLoadedState extends Store.AbstractIdealState<SelectItem[]> { }

export class WidgetInfoLoadedState extends Store.AbstractIdealState<SelectItem[]> { }
