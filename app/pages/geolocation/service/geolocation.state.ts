import { Menu, MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { GeolocationData } from './geolocation.model';

export class GeolocationDataLoadingState extends Store.AbstractLoadingState<GeolocationData> {}
export class GeolocationDataLoadingErrorState extends Store.AbstractErrorState<GeolocationData> {}
export class GeolocationDataLoadedState extends Store.AbstractIdealState<GeolocationData> {}