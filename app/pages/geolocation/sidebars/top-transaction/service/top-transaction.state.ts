import { Store } from 'src/app/core/store/store';
import { TopTransactionData } from './top-transaction.model';

export class TopTransactionsLoadingState extends Store.AbstractLoadingState<TopTransactionData> { }
export class TopTransactionsLoadingErrorState extends Store.AbstractErrorState<TopTransactionData> { }
export class TopTransactionsLoadedState extends Store.AbstractIdealState<TopTransactionData> { }