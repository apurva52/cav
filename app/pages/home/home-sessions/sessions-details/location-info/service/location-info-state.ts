
import { Store } from 'src/app/core/store/store';

export class LocationInfoLoadingErrorState extends Store.AbstractLoadingState<[]> { }
export class LocationInfoLoadingState extends Store.AbstractErrorState<[]> { }
export class LocationInfoLoadedState extends Store.AbstractIdealState<[]> { }
