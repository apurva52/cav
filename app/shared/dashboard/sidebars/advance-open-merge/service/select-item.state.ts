import { Store } from 'src/app/core/store/store';
import { SelectItem } from 'primeng';

export class GraphOprationLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class TireLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class ServerLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class InstenceLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class BusinessTransactionsLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class ValuesLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class OpenwithWidgetsLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class OperatersLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class FilterByLoadedState extends Store.AbstractIdealState<SelectItem[]> {}

export class CriteriaLoadedState extends Store.AbstractIdealState<SelectItem[]> {}