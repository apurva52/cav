import { Store } from 'src/app/core/store/store';
import { DBReportData } from './db-queries.model';

export class DbQueriesLoadingState extends Store.AbstractLoadingState<DBReportData> { }
export class DbQueriesLoadingErrorState extends Store.AbstractErrorState<DBReportData> { }
export class DbQueriesLoadedState extends Store.AbstractIdealState<DBReportData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }
