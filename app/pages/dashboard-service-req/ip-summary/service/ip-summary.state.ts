import { Store } from 'src/app/core/store/store';
import { IndIpData, IpSummaryData } from './ip-summary.model';


export class IpSummaryLoadingState extends Store.AbstractLoadingState<IpSummaryData> { }
export class IpSummaryLoadingErrorState extends Store.AbstractErrorState<IpSummaryData> { }
export class IpSummaryLoadedState extends Store.AbstractIdealState<IpSummaryData> { }

export class IndIpLoadingState extends Store.AbstractLoadingState<IndIpData> { }
export class IndIpLoadingErrorState extends Store.AbstractErrorState<IndIpData> { }
export class IndIpLoadedState extends Store.AbstractIdealState<IndIpData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }


