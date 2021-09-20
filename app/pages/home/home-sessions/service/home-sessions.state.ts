import { Store } from 'src/app/core/store/store';
import { SessionsTable } from "./home-sessions.model";

export class HomeSessionsLoadingState extends Store.AbstractLoadingState< SessionsTable> {}
export class HomeSessionsLoadingErrorState extends Store.AbstractErrorState<SessionsTable> {}
export class HomeSessionsLoadedState extends Store.AbstractIdealState<SessionsTable> {
  isActive = false;
  constructor(data, isActive) {
    super(data);
    this.isActive = isActive;
  }
}
