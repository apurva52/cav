import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { FormAnalyticsOverAllReportTable } from "./form-analytic-overall.model";

export class OverAllReportLoadingState extends Store.AbstractLoadingState<FormAnalyticsOverAllReportTable> { }
export class OverAllReportLoadingErrorState extends Store.AbstractErrorState<FormAnalyticsOverAllReportTable> { }
export class OverAllReportLoadedState extends Store.AbstractIdealState<FormAnalyticsOverAllReportTable> { }
