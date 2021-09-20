import { Store } from 'src/app/core/store/store';
import { FlowpathAnalyzerData } from './flowpath-analyzer.model';


export class FlowpathAnalyzerLoadingState extends Store.AbstractLoadingState<FlowpathAnalyzerData> { }
export class FlowpathAnalyzerLoadingErrorState extends Store.AbstractErrorState<FlowpathAnalyzerData> { }
export class FlowpathAnalyzerLoadedState extends Store.AbstractIdealState<FlowpathAnalyzerData> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }
