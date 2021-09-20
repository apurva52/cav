import { Store } from 'src/app/core/store/store';
import { PageFilterTable } from './page-filter.model';

export class PageListLoadingErrorState extends Store.AbstractLoadingState<PageFilterTable> { }
export class PageListLoadingState extends Store.AbstractErrorState<PageFilterTable> { }
export class PageListLoadedState extends Store.AbstractIdealState<PageFilterTable> { }