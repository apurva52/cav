import { Store } from 'src/app/core/store/store';
import { MetricsTable } from './metrics-settings.model';

export class MetricsLoadingState extends Store.AbstractLoadingState<MetricsTable> { }
export class MetricsLoadingErrorState extends Store.AbstractErrorState<MetricsTable> { }
export class MetricsLoadedState extends Store.AbstractIdealState<MetricsTable> { }

