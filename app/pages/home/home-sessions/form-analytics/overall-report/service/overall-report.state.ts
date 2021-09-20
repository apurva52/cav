import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { overallReportTable } from "./overall-report.model";

export class OverAllReportLoadingState extends Store.AbstractLoadingState<overallReportTable> { }
export class OverAllReportLoadingErrorState extends Store.AbstractErrorState<overallReportTable> { }
export class OverAllReportLoadedState extends Store.AbstractIdealState<overallReportTable> { }
