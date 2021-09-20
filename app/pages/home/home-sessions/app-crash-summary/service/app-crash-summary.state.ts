import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';


export class AppCrashSummaryLoadingErrorState extends Store.AbstractLoadingState<Table> { }
export class AppCrashSummaryLoadingState extends Store.AbstractErrorState<Table> { }
export class AppCrashSummaryLoadedState extends Store.AbstractIdealState<Table> { }

