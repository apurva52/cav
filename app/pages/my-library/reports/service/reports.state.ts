import { Store } from 'src/app/core/store/store';

export class SchedulerEnableLoadingState extends Store.AbstractLoadingState<any>{}
export class SchedulerEnableLoadedState extends Store.AbstractIdealState<any>{}
export class SchedulerEnableLoadingErrorState extends Store.AbstractErrorState<any>{}