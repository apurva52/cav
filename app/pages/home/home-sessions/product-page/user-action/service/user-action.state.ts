import { Store } from 'src/app/core/store/store';
import { UserActionTable } from './user-action.model';

export class UserActionLoadingErrorState extends Store.AbstractLoadingState<UserActionTable> { }
export class UserActionLoadingState extends Store.AbstractErrorState<UserActionTable> { }
export class UserActionLoadedState extends Store.AbstractIdealState<UserActionTable> { }