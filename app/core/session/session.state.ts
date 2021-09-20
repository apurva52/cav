import { Store } from '../store/store';
import { Session, PreSession } from './session.model';

export class SessionCreatingState extends Store.AbstractLoadingState<Session> {}
export class SessionCreatingErrorState extends Store.AbstractErrorState<Session> {}
export class SessionCreatedState extends Store.AbstractIdealState<Session> {}


export class PreSessionCreatingState extends Store.AbstractLoadingState<PreSession> {}
export class PreSessionCreatingErrorState extends Store.AbstractErrorState<PreSession> {}
export class PreSessionCreatedState extends Store.AbstractIdealState<PreSession> {}

export class SessionDestroyingState extends Store.AbstractLoadingState<Session> {}
export class SessionDestroyingErrorState extends Store.AbstractErrorState<Session> {}
export class SessionDestroyedState extends Store.AbstractIdealState<Session> {}


