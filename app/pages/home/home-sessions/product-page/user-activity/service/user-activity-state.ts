import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';


export class UserActivityLoadingErrorState extends Store.AbstractLoadingState<Table> { }
export class UserActivityLoadingState extends Store.AbstractErrorState<Table> { }
export class UserActivityLoadedState extends Store.AbstractIdealState<Table> { }

