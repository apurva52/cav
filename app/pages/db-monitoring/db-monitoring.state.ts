import { Store } from 'src/app/core/store/store';
import { Status } from 'src/assets/dummyData/data-call-res.model';
import { DBMonTable } from './services/dbmon-table.model';


export class DBMonitoringLoadingState extends Store.AbstractLoadingState<DBMonTable> {}
export class DBMonitoringLoadingErrorState extends Store.AbstractErrorState<DBMonTable> {}
export class DBMonitoringLoadedState extends Store.AbstractIdealState<DBMonTable> {}

export class DBMonitoringLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class DBMonitoringLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class DBMonitoringLoadedStatus extends Store.AbstractIdealState<Status> {}