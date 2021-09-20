
import { Store } from 'src/app/core/store/store';
import { SchedulesTable } from './schedules.model'


export class SchedulesTableLoadingState extends Store.AbstractLoadingState<SchedulesTable[]>{}
export class SchedulesTableLoadedState extends Store.AbstractIdealState<SchedulesTable[]>{}
export class SchedulesTableLoadingErrorState extends Store.AbstractErrorState<SchedulesTable[]>{}

export class SchedulesDeleteLoadingState extends Store.AbstractLoadingState<any>{}
export class SchedulesDeleteLoadedState extends Store.AbstractIdealState<any>{}
export class SchedulesDeleteLoadingErrorState extends Store.AbstractErrorState<any>{}

export class StatusChangeLoadingState extends Store.AbstractLoadingState<any>{}
export class StatusChangeLoadedState extends Store.AbstractLoadingState<any>{}
export class StatusChangeLoadingErrorState extends Store.AbstractLoadingState<any>{}

export class editTaskLoadingState extends Store.AbstractLoadingState<any>{}
export class editTaskLoadedState extends Store.AbstractLoadingState<any>{}
export class editTaskLoadingErrorState extends Store.AbstractLoadingState<any>{}

export class onDownloadLoadingState extends Store.AbstractLoadingState<any>{}
export class onDownloadLoadedState extends Store.AbstractLoadingState<any>{}
export class onDownloadLoadingErrorState extends Store.AbstractLoadingState<any>{}