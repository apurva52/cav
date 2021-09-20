

import { Store } from 'src/app/core/store/store';
import { EventsDataTable } from './events-data.model';

export class EventLoadingErrorState extends Store.AbstractLoadingState<EventsDataTable> { }
export class EventLoadingState extends Store.AbstractErrorState<EventsDataTable> { }
export class EventLoadedState extends Store.AbstractIdealState<EventsDataTable> { }