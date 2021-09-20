import { Store } from '../../../core/store/store';
import {  DrillDownFilterData } from './drilldown-filter.model';


export class DrillDownFilterLoadingState extends Store.AbstractLoadingState<DrillDownFilterData> {}
export class DrillDownFilterLoadingErrorState extends Store.AbstractErrorState<DrillDownFilterData> {}
export class DrillDownFilterLoadedState extends Store.AbstractIdealState<DrillDownFilterData> {}
