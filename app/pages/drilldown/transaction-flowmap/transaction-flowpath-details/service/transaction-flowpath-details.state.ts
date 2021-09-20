import { Store } from 'src/app/core/store/store';
import { TransactionFlowpathDetailsTable } from './transaction-flowpath-details.model';

export class TransactionFlowpathDetailsLoadingState extends Store.AbstractLoadingState<TransactionFlowpathDetailsTable> { }
export class TransactionFlowpathDetailsLoadingErrorState extends Store.AbstractErrorState<TransactionFlowpathDetailsTable> { }
export class TransactionFlowpathDetailsLoadedState extends Store.AbstractIdealState<TransactionFlowpathDetailsTable> { }
