import { Store } from 'src/app/core/store/store';
import { MethodCallDetailsData} from './method-call-details.model';

export class MethodCallDetailsLoadingState extends Store.AbstractLoadingState<MethodCallDetailsData> { }
export class MethodCallDetailsLoadingErrorState extends Store.AbstractErrorState<MethodCallDetailsData> { }
export class MethodCallDetailsLoadedState extends Store.AbstractIdealState<MethodCallDetailsData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }

export class childFlowpathLoadingState extends Store.AbstractLoadingState<MethodCallDetailsData> { }
export class childFlowpathErrorState extends Store.AbstractErrorState<MethodCallDetailsData> { }
export class childFlowpathLoadedState extends Store.AbstractIdealState<MethodCallDetailsData> { }
