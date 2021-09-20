import { Store } from 'src/app/core/store/store';
import { BusinessTransactionJacket } from './business-transaction-jacket.model';

export class BusinessTransactionJacketLoadingState extends Store.AbstractLoadingState<
  BusinessTransactionJacket
> {}
export class BusinessTransactionJacketLoadingErrorState extends Store.AbstractErrorState<
  BusinessTransactionJacket
> {}
export class BusinessTransactionJacketLoadedState extends Store.AbstractIdealState<
  BusinessTransactionJacket
> {}
