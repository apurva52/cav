import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { CustomMetricsReportTable } from "./custommetrics.model";

export class HomePageTabLoadingState extends Store.AbstractLoadingState<CustomMetricsReportTable> { }
export class HomePageTabLoadingErrorState extends Store.AbstractErrorState<CustomMetricsReportTable> { }
export class HomePageTabLoadedState extends Store.AbstractIdealState<CustomMetricsReportTable> { }