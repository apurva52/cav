import { Store } from 'src/app/core/store/store';
import { TransactionGroupTable } from './transactions-group.model';

export class TransactionGroupLoadingState extends Store.AbstractLoadingState<TransactionGroupTable> { }
export class TransactionGroupLoadingErrorState extends Store.AbstractErrorState<TransactionGroupTable> { }
export class TransactionGroupLoadedState extends Store.AbstractIdealState<TransactionGroupTable> { }
