import { Store } from 'src/app/core/store/store';
import { UserMenuOption } from './user-options.model';

export class UserMenuOptionLoadingState extends Store.AbstractLoadingState<UserMenuOption[]> {}
export class UserMenuOptionLoadingErrorState extends Store.AbstractErrorState<UserMenuOption[]> {}
export class UserMenuOptionLoadedState extends Store.AbstractIdealState<UserMenuOption[]> {}
