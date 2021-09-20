import { Store } from 'src/app/core/store/store';

export class DevicePreferenceLoadingErrorState extends Store.AbstractLoadingState<any> { }
export class DevicePreferenceLoadingState extends Store.AbstractErrorState<any> { }
export class DevicePreferenceLoadedState extends Store.AbstractIdealState<any> { }

