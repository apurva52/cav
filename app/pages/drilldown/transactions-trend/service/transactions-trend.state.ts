import { Store } from '../../../../core/store/store';
import { TransactionTrendData } from './transactions-trend.model';

export class TransactionTrendLoadingState extends Store.AbstractLoadingState<TransactionTrendData> { }
export class TransactionTrendLoadingErrorState extends Store.AbstractErrorState<TransactionTrendData> { }
export class TransactionTrendLoadedState extends Store.AbstractIdealState<TransactionTrendData> { }
