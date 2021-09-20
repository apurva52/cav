import { Store } from 'src/app/core/store/store';
import { CustomDataTable } from './custom-metrics.model';

export class CustomMetricsLoadingErrorState extends Store.AbstractLoadingState<CustomDataTable> { }
export class CustomMetricsLoadingState extends Store.AbstractErrorState<CustomDataTable> { }
export class CustomMetricsLoadedState extends Store.AbstractIdealState<CustomDataTable> { }