import { Store } from 'src/app/core/store/store';
import { ServiceMethodTimingData } from './service-method-timing.model';


export class ServiceMethodTimingLoadingState extends Store.AbstractLoadingState<ServiceMethodTimingData> { }
export class ServiceMethodTimingLoadingErrorState extends Store.AbstractErrorState<ServiceMethodTimingData> { }
export class ServiceMethodTimingLoadedState extends Store.AbstractIdealState<ServiceMethodTimingData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }