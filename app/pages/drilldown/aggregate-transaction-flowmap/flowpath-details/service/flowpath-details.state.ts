import { Store } from 'src/app/core/store/store';
import { FlowpathDetailsTable } from './flowpath-details.model';

export class FlowpathDetailsLoadingState extends Store.AbstractLoadingState<FlowpathDetailsTable> { }
export class FlowpathDetailsLoadingErrorState extends Store.AbstractErrorState<FlowpathDetailsTable> { }
export class FlowpathDetailsLoadedState extends Store.AbstractIdealState<FlowpathDetailsTable> { }
