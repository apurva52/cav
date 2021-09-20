import { Store } from 'src/app/core/store/store';
import { Table } from 'src/app/shared/table/table.model';


export class TransactionsLoadingErrorState extends Store.AbstractLoadingState<Table> { }
export class TransactionsLoadingState extends Store.AbstractErrorState<Table> { }
export class TransactionsLoadedState extends Store.AbstractIdealState<Table> { }
