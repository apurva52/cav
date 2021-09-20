//import { metrics } from './../../../../../shared/metrics/relatedmetrics/service/relatedmetrics.model';

import { Store } from 'src/app/core/store/store';
import { MetricsHeaderCols, MetricsTableHeader, MetricsTable } from './metrics.model';

export class MetricsHeaderColsLoadingState extends Store.AbstractLoadingState<MetricsHeaderCols[]> { }
export class MetricsHeaderColsLoadingErrorState extends Store.AbstractErrorState<MetricsHeaderCols[]> { }
export class MetricsHeaderColsLoadedState extends Store.AbstractIdealState<MetricsHeaderCols[]> { }

export class MetricsTableHeaderLoadingState extends Store.AbstractLoadingState<MetricsTableHeader[]> { }
export class MetricsTableHeaderLoadingErrorState extends Store.AbstractErrorState<MetricsTableHeader[]> { }
export class MetricsTableHeaderLoadedState extends Store.AbstractIdealState<MetricsTableHeader[]> { }

export class MetricsTableLoadingState extends Store.AbstractLoadingState<MetricsTable[]> { }
export class MetricsTableLoadingErrorState extends Store.AbstractErrorState<MetricsTable[]> { }
export class MetricsTableLoadedState extends Store.AbstractIdealState<MetricsTable[]> { }

export class DeleteReportLoadingState extends Store.AbstractLoadingState<any>{ }
export class DeleteReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DeleteReportLoadedState extends Store.AbstractIdealState<any>{ }

export class ReuseReportLoadingState extends Store.AbstractLoadingState<any>{ }
export class ReuseReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class ReuseReportLoadedState extends Store.AbstractIdealState<any>{ }

export class onDownloadLoadingState extends Store.AbstractLoadingState<any>{}
export class onDownloadLoadedState extends Store.AbstractLoadingState<any>{}
export class onDownloadLoadingErrorState extends Store.AbstractLoadingState<any>{}
