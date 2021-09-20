import { Store } from 'src/app/core/store/store';
import { AlertsTable, EventCounts, EventResponse, Events, FilteredEventsWithTag } from './alert-table.model';
import { Status } from './alert.model';

export class EventsDataLoadingState extends Store.AbstractLoadingState<AlertsTable> {}
export class EventsDataLoadingErrorState extends Store.AbstractErrorState<AlertsTable> {}
export class EventsDataLoadedState extends Store.AbstractIdealState<AlertsTable> {}


export class EventsResLoadingState extends Store.AbstractLoadingState<EventResponse> {}
export class EventsResLoadingErrorState extends Store.AbstractErrorState<EventResponse> {}
export class EventsResLoadedState extends Store.AbstractIdealState<EventResponse> {}

export class EventsArrayLoadingState extends Store.AbstractLoadingState<Events[]> {}
export class EventsArrayLoadingErrorState extends Store.AbstractErrorState<Events[]> {}
export class EventsArrayLoadedState extends Store.AbstractIdealState<Events[]> {}

export class FilterEventsArrayLoadingState extends Store.AbstractLoadingState<FilteredEventsWithTag[]> {}
export class FilterEventsArrayLoadingErrorState extends Store.AbstractErrorState<FilteredEventsWithTag[]> {}
export class FilterEventsArrayLoadedState extends Store.AbstractIdealState<FilteredEventsWithTag[]> {}

export class CounterLoadingState extends Store.AbstractLoadingState<EventCounts[]> {}
export class CounterLoadingErrorState extends Store.AbstractErrorState<EventCounts[]> {}
export class CounterLoadedState extends Store.AbstractIdealState<EventCounts[]> {}

export class MaintenanceStateLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class MaintenanceStateLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class MaintenanceStateLoadedStatus extends Store.AbstractIdealState<Status> {}

export class DownloadingState extends Store.AbstractLoadingState<any> { }
export class DownloadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadedState extends Store.AbstractIdealState<any> { }
