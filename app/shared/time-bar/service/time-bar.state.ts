import { Store } from 'src/app/core/store/store';
import { GlobalTimebarResponse, AlertMarker } from './time-bar.model';


export class GlobalTimebarLoadingState extends Store.AbstractLoadingState<GlobalTimebarResponse> { }
export class GlobalTimebarLoadingErrorState extends Store.AbstractErrorState<GlobalTimebarResponse> { }
export class GlobalTimebarLoadedState extends Store.AbstractIdealState<GlobalTimebarResponse> { }

export class GlobalTimebarTimeLoadingState extends Store.AbstractLoadingState<number[]> { }
export class GlobalTimebarTimeLoadingErrorState extends Store.AbstractErrorState<number[]> { }
export class GlobalTimebarTimeLoadedState extends Store.AbstractIdealState<number[]> { }


export class GlobalTimebarAlertLoadingState extends Store.AbstractLoadingState<AlertMarker[]> { }
export class GlobalTimebarAlertLoadingErrorState extends Store.AbstractErrorState<AlertMarker[]> { }
export class GlobalTimebarAlertLoadedState extends Store.AbstractIdealState<AlertMarker[]> { }
