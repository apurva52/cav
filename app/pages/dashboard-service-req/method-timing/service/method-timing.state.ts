
import { Store } from 'src/app/core/store/store';
import { MethodTimingData } from './method-timing.model';

export class MethodTimingLoadingState extends Store.AbstractLoadingState<MethodTimingData> { }
export class MethodTimingLoadingErrorState extends Store.AbstractErrorState<MethodTimingData> { }
export class MethodTimingLoadedState extends Store.AbstractIdealState<MethodTimingData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }