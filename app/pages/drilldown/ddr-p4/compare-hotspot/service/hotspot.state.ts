import { Store } from 'src/app/core/store/store';
import { HotspotData, StackTraceData } from './hotspot.model';

export class HotspotLoadingState extends Store.AbstractLoadingState<HotspotData> {}
export class HotspotLoadingErrorState extends Store.AbstractErrorState<HotspotData> {}
export class HotspotLoadedState extends Store.AbstractIdealState<HotspotData> {}

export class StackTraceLoadingState extends Store.AbstractLoadingState<StackTraceData> {}
export class StackTraceLoadingErrorState extends Store.AbstractErrorState<StackTraceData> {}
export class StackTraceLoadedState extends Store.AbstractIdealState<StackTraceData> {}

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }