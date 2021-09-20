import { Store } from 'src/app/core/store/store';
import { DataCenter } from './data-center.model';

export class DataCenterLoadingState extends Store.AbstractLoadingState<DataCenter[]> {}
export class DataCenterLoadingErrorState extends Store.AbstractErrorState<DataCenter[]> {}
export class DataCenterLoadedState extends Store.AbstractIdealState<DataCenter[]> {}
