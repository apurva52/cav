import { Store } from 'src/app/core/store/store';
import { HotspotData, StackTraceData, HsIpCallsData } from './hotspot.model';

export class HotspotLoadingState extends Store.AbstractLoadingState<HotspotData> {}
export class HotspotLoadingErrorState extends Store.AbstractErrorState<HotspotData> {}
export class HotspotLoadedState extends Store.AbstractIdealState<HotspotData> {}

export class StackTraceLoadingState extends Store.AbstractLoadingState<StackTraceData> {}
export class StackTraceLoadingErrorState extends Store.AbstractErrorState<StackTraceData> {}
export class StackTraceLoadedState extends Store.AbstractIdealState<StackTraceData> {}

export class IpCallsLoadingState extends Store.AbstractLoadingState<HsIpCallsData> {}
export class IpCallsLoadingErrorState extends Store.AbstractErrorState<HsIpCallsData> {}
export class IpCallsLoadedState extends Store.AbstractIdealState<HsIpCallsData> {}

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }