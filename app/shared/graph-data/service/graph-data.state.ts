import { Store } from 'src/app/core/store/store';
import { GraphDataTable } from './graph-data.model';

export class GraphDataLoadingState extends Store.AbstractLoadingState<GraphDataTable> { }
export class GraphDataLoadingErrorState extends Store.AbstractErrorState<GraphDataTable> { }
export class GraphDataLoadedState extends Store.AbstractIdealState<GraphDataTable> { }

export class DownloadShowGrapDataLoadingState extends Store.AbstractLoadingState<any> { }
export class DownloadShowGrapDataLoadingErrorState extends Store.AbstractErrorState<any> { }
export class DownloadShowGrapDataLoadedState extends Store.AbstractIdealState<any> { }
