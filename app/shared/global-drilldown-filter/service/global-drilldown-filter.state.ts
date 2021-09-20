import { Store } from '../../../core/store/store';
import { GlobalDrillDownFilterData } from './global-drilldown-filter.model';


export class GlobalDrillDownFilterLoadingState extends Store.AbstractLoadingState<GlobalDrillDownFilterData> {}
export class GlobalDrillDownFilterLoadingErrorState extends Store.AbstractErrorState<GlobalDrillDownFilterData> {}
export class GlobalDrillDownFilterLoadedState extends Store.AbstractIdealState<GlobalDrillDownFilterData> {}
