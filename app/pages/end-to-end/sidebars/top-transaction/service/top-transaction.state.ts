import { Store } from 'src/app/core/store/store';
import { TopTransactionTable } from './top-transaction.model';

export class TopTransactionLoadingState extends Store.AbstractLoadingState<TopTransactionTable> {}
export class TopTransactionLoadingErrorState extends Store.AbstractErrorState<TopTransactionTable> {}
export class TopTransactionLoadedState extends Store.AbstractIdealState<TopTransactionTable> {}