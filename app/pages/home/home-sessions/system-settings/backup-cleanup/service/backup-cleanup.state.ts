import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';


export class BackupCleanupLoadingErrorState extends Store.AbstractLoadingState<Table> { }
export class BackupCleanupLoadingState extends Store.AbstractErrorState<Table> { }
export class BackupCleanupLoadedState extends Store.AbstractIdealState<Table> { }

