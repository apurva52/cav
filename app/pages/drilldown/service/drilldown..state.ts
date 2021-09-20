import { Store } from 'src/app/core/store/store';
import { Drilldown } from './drilldown.model';


export class DrilldownLoadingState extends Store.AbstractLoadingState<Drilldown[]> { }
export class DrilldownLoadingErrorState extends Store.AbstractErrorState<Drilldown[]> { }
export class DrilldownLoadedState extends Store.AbstractIdealState<Drilldown[]> { }
