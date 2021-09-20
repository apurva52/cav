import { Store } from 'src/app/core/store/store';
import { TransactionFlowMapData } from './transaction-flowmap.model';

export class TransactionFlowMapLoadingState extends Store.AbstractLoadingState<TransactionFlowMapData> { }
export class TransactionFlowMapLoadingErrorState extends Store.AbstractErrorState<TransactionFlowMapData> { }
export class TransactionFlowMapLoadedState extends Store.AbstractIdealState<TransactionFlowMapData> { }
