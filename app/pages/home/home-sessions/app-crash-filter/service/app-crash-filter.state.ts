import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';


export class AppCrashFilterLoadingErrorState extends Store.AbstractLoadingState<Table> { }
export class AppCrashFilterLoadingState extends Store.AbstractErrorState<Table> { }
export class AppCrashFilterLoadedState extends Store.AbstractIdealState<Table> { }

