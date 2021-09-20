import { Store } from 'src/app/core/store/store';
import { EventResponse } from './event.model';

export class EventGroupLoadingState extends Store.AbstractLoadingState<EventResponse> { }
export class EventGroupLoadingErrorState extends Store.AbstractErrorState<EventResponse> { }
export class EventGroupLoadedState extends Store.AbstractIdealState<EventResponse> { }
