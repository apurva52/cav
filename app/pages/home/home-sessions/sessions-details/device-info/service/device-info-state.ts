
import { Store } from 'src/app/core/store/store';

export class DeviceInfoLoadingErrorState extends Store.AbstractLoadingState<[]> { }
export class DeviceInfoLoadingState extends Store.AbstractErrorState<[]> { }
export class DeviceInfoLoadedState extends Store.AbstractIdealState<[]> { }
