import { Store } from 'src/app/core/store/store';
import { UserTimingDataTable } from './user-timing-data.model';

export class UserTimingLoadingErrorState extends Store.AbstractLoadingState<UserTimingDataTable> { }
export class UserTimingLoadingState extends Store.AbstractErrorState<UserTimingDataTable> { }
export class UserTimingLoadedState extends Store.AbstractIdealState<UserTimingDataTable> { }
