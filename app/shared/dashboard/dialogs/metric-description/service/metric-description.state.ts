import { Store } from 'src/app/core/store/store';

export class MetricDescLoadingState extends Store.AbstractLoadingState<any> { }
export class MetricDescLoadingErrorState extends Store.AbstractErrorState<any> { }
export class MetricDescLoadedState extends Store.AbstractIdealState<any> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }

