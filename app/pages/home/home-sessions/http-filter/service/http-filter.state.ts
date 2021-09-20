import { Store } from '../../../../../core/store/store';
import { HttpAggFilterTable } from './http-filter.model';

export class HttpAggListLoadingErrorState extends Store.AbstractLoadingState<HttpAggFilterTable> { }
export class HttpAggListLoadingState extends Store.AbstractErrorState<HttpAggFilterTable> { }
export class HttpAggListLoadedState extends Store.AbstractIdealState<HttpAggFilterTable> { }