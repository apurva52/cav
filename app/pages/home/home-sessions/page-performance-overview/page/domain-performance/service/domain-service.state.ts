import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { DomainPerformanceTable } from "./domain-performance.model";

export class HomePageTabLoadingState extends Store.AbstractLoadingState<DomainPerformanceTable> { }
export class HomePageTabLoadingErrorState extends Store.AbstractErrorState<DomainPerformanceTable> { }
export class HomePageTabLoadedState extends Store.AbstractIdealState<DomainPerformanceTable> { }