import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { DomainPerformanceCompareTable } from "./domain-performance.model";

export class HomePageTabLoadingState extends Store.AbstractLoadingState<DomainPerformanceCompareTable> { }
export class HomePageTabLoadingErrorState extends Store.AbstractErrorState<DomainPerformanceCompareTable> { }
export class HomePageTabLoadedState extends Store.AbstractIdealState<DomainPerformanceCompareTable> { }