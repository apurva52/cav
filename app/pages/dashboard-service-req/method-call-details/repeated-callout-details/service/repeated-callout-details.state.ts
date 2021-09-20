import { Store } from 'src/app/core/store/store';
import { RepeatedCalloutDetailsTable } from './repeated-callout-details.model';

export class RepeatedCalloutDetailsLoadingState extends Store.AbstractLoadingState<RepeatedCalloutDetailsTable> { }
export class RepeatedCalloutDetailsLoadingErrorState extends Store.AbstractErrorState<RepeatedCalloutDetailsTable> { }
export class RepeatedCalloutDetailsLoadedState extends Store.AbstractIdealState<RepeatedCalloutDetailsTable> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }
