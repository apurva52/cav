import { Store } from 'src/app/core/store/store';
import { StoreDetailsData } from './store-details.model';


export class StoreDataLoadingState extends Store.AbstractLoadingState<StoreDetailsData> {}
export class StoreDataLoadingErrorState extends Store.AbstractErrorState<StoreDetailsData> {}
export class StoreDataLoadedState extends Store.AbstractIdealState<StoreDetailsData> {}