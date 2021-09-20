import { Store } from 'src/app/core/store/store';
import { SessionEventTable } from './session-event.model';

export class SessionEventLoadingErrorState extends Store.AbstractLoadingState<SessionEventTable> { }
export class SessionEventLoadingState extends Store.AbstractErrorState<SessionEventTable> { }
export class SessionEventLoadedState extends Store.AbstractIdealState<SessionEventTable> { }