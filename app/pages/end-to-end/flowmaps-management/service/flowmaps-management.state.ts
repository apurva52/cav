import { Store } from 'src/app/core/store/store';
import { FlowMapsData } from './flowmaps-management.model';

export class FlowMapsDataLoadingState extends Store.AbstractLoadingState<FlowMapsData> {}
export class FlowMapsDataLoadingErrorState extends Store.AbstractErrorState<FlowMapsData> {}
export class FlowMapsDataLoadedState extends Store.AbstractIdealState<FlowMapsData> {}