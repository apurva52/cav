import { Store } from 'src/app/core/store/store';
import { GlobalReportTimebarResponse } from './add-report.model';


export class ReportTimebarLoadingState extends Store.AbstractLoadingState<GlobalReportTimebarResponse> { }
export class ReportTimebarLoadingErrorState extends Store.AbstractErrorState<GlobalReportTimebarResponse> { }
export class ReportTimebarLoadedState extends Store.AbstractIdealState<GlobalReportTimebarResponse> { }

export class ReportTimebarTimeLoadingState extends Store.AbstractLoadingState<number[]> { }
export class ReportTimebarTimeLoadingErrorState extends Store.AbstractErrorState<number[]> { }
export class ReportTimebarTimeLoadedState extends Store.AbstractIdealState<number[]> { }

export class ReportTemplateListLoadingState extends Store.AbstractLoadingState<any> { }
export class ReportTemplateListLoadingErrorState extends Store.AbstractErrorState<any> { }
export class ReportTemplateListLoadedState extends Store.AbstractIdealState<any> { }

export class GenerateReportLoadingState extends Store.AbstractLoadingState<any> { }
export class GenerateReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class GenerateReportLoadedState extends Store.AbstractIdealState<any> { }

export class TransactionErrorCodeLoadingState extends Store.AbstractLoadingState<any> { }
export class TransactionErrorCodeLoadingErrorState extends Store.AbstractErrorState<any> { }
export class TransactionErrorCodeLoadedState extends Store.AbstractIdealState<any> { }

export class AddReportGroupLoadingState extends Store.AbstractLoadingState<any> { }
export class AddReportGroupLoadingErrorState extends Store.AbstractErrorState<any> { }
export class AddReportGroupLoadedState extends Store.AbstractIdealState<any> { }

export class getMetricServiceLoading extends Store.AbstractLoadingState<any>{ }
export class getMetricServiceLoaded extends Store.AbstractIdealState<any>{ }
export class getMetricServiceLoadingError extends Store.AbstractErrorState<any>{ }

export class getChartAndReportDataLoading extends Store.AbstractLoadingState<any>{ }
export class getChartAndReportDataLoaded extends Store.AbstractIdealState<any>{ }
export class getChartAndReportDataError extends Store.AbstractErrorState<any>{ }

export class createChartAndReportLoading extends Store.AbstractLoadingState<any>{ }
export class createChartAndReportLoaded extends Store.AbstractIdealState<any>{ }
export class createChartAndReportError extends Store.AbstractErrorState<any>{ }

export class ThresholdTemplateListLoadingState extends Store.AbstractLoadingState<any>{ }
export class ThresholdTemplateListLoadedState extends Store.AbstractIdealState<any>{ }
export class ThresholdTemplateListLoadingErrorState extends Store.AbstractErrorState<any>{ }
