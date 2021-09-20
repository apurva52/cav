import { Store } from 'src/app/core/store/store';
import { SearchSidebarData } from './search-sidebar.model';

export class SearchSidebarLoadingState extends Store.AbstractLoadingState<SearchSidebarData> {}
export class SearchSidebarLoadingErrorState extends Store.AbstractErrorState<SearchSidebarData> {}
export class SearchSidebarLoadedState extends Store.AbstractIdealState<SearchSidebarData> {}