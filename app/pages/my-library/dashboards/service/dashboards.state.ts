import { Store } from 'src/app/core/store/store';
import { MyDashboardsTable, Status } from './dashboards.model';
import { FileDownload } from 'src/app/shared/download-file/services/download-file.model';

export class DashboardDataLoadingState extends Store.AbstractLoadingState<MyDashboardsTable> {}
export class DashboardDataLoadingErrorState extends Store.AbstractErrorState<MyDashboardsTable> {}
export class DashboardDataLoadedState extends Store.AbstractIdealState<MyDashboardsTable> {}

export class DashboardStateLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class DashboardStateLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class DashboardStateLoadedStatus extends Store.AbstractIdealState<Status> {}

export class FileDownloadLoadingState extends Store.AbstractLoadingState<FileDownload[]> {}
export class FileDownloadLoadingErrorState extends Store.AbstractErrorState<FileDownload[]> {}
export class FileDownloadLoadedState extends Store.AbstractIdealState<FileDownload[]> {}
