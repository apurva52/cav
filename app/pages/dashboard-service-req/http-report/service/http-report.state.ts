import { Store } from 'src/app/core/store/store';
import { HttpReportData } from './http-report.model';


export class HttpReportLoadingState extends Store.AbstractLoadingState<HttpReportData> { }
export class HttpReportLoadingErrorState extends Store.AbstractErrorState<HttpReportData> { }
export class HttpReportLoadedState extends Store.AbstractIdealState<HttpReportData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }
