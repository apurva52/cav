import { Store } from 'src/app/core/store/store';
import {EventsTable} from './event.model'

export class EventLoadingState extends Store.AbstractLoadingState<EventsTable> { }
export class EventLoadingErrorState extends Store.AbstractErrorState<EventsTable> { }
export class EventLoadedState extends Store.AbstractIdealState<EventsTable> { }
