import { Store } from 'src/app/core/store/store';
import { FlowPathTable } from './flow-path.model';

export class FlowPathLoadingState extends Store.AbstractLoadingState<FlowPathTable> { }
export class FlowPathLoadingErrorState extends Store.AbstractErrorState<FlowPathTable> { }
export class FlowPathLoadedState extends Store.AbstractIdealState<FlowPathTable> { }

export class DownloadReportLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadReportLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadReportLoadedState extends Store.AbstractIdealState<any> { }
