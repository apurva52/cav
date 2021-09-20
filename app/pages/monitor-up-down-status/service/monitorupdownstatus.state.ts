import { Store } from 'src/app/core/store/store';
import { MonitorupdownstatusTable } from './monitorupdownstatus.model';

export class MonitorupdownstatusLoadingState extends Store.AbstractLoadingState<MonitorupdownstatusTable> {}
export class MonitorupdownstatusErrorState extends Store.AbstractErrorState<MonitorupdownstatusTable> {}
export class MonitorupdownstatusLoadedState extends Store.AbstractIdealState<MonitorupdownstatusTable> {}
