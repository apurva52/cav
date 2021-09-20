import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { PerformanceTable } from "./resource-performance.model";

export class HomePageTabLoadingState extends Store.AbstractLoadingState<PerformanceTable> { }
export class HomePageTabLoadingErrorState extends Store.AbstractErrorState<PerformanceTable> { }
export class HomePageTabLoadedState extends Store.AbstractIdealState<PerformanceTable> { }