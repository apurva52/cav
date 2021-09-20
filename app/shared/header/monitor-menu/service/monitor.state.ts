import { Store } from 'src/app/core/store/store';
import { MonitorResponse } from './monitor.model';


export class MonitorLoadingState extends Store.AbstractLoadingState<MonitorResponse> { }
export class MonitorLoadingErrorState extends Store.AbstractErrorState<MonitorResponse> { }
export class MonitorLoadedState extends Store.AbstractIdealState<MonitorResponse> { }
