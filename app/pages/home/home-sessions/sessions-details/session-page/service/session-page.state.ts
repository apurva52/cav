
import { Store } from 'src/app/core/store/store';
import { SessionsDataTable } from './session-page-data.model';

export class SessionPageLoadingErrorState extends Store.AbstractLoadingState<SessionsDataTable> { }
export class SessionPageLoadingState extends Store.AbstractErrorState<SessionsDataTable> { }
export class SessionPageLoadedState extends Store.AbstractIdealState<SessionsDataTable> { }
