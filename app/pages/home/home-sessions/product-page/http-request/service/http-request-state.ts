import { Store } from 'src/app/core/store/store';
import { HttpDataTable } from './http-request-data.model';

export class HttpLoadingErrorState extends Store.AbstractLoadingState<HttpDataTable> { }
export class HttpLoadingState extends Store.AbstractErrorState<HttpDataTable> { }
export class HttpLoadedState extends Store.AbstractIdealState<HttpDataTable> { }
