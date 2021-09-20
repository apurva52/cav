import { Store } from 'src/app/core/store/store';
import { ChartConfig } from './chart.model';

export class ChartLoadingState extends Store.AbstractLoadingState<ChartConfig[]> {}
export class ChartLoadingErrorState extends Store.AbstractErrorState<ChartConfig[]> {}
export class ChartLoadedState extends Store.AbstractIdealState<ChartConfig[]> {}
