import { Store } from 'src/app/core/store/store';
import { AggregateTransactionFlowmapData } from './aggregate-transaction-flowmap.model';

export class AggregateTransactionFlowmapLoadingState extends Store.AbstractLoadingState<AggregateTransactionFlowmapData> { }
export class AggregateTransactionFlowmapLoadingErrorState extends Store.AbstractErrorState<AggregateTransactionFlowmapData> { }
export class AggregateTransactionFlowmapLoadedState extends Store.AbstractIdealState<AggregateTransactionFlowmapData> { }
