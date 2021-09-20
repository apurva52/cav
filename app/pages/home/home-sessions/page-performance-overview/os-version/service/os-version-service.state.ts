import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { PageTable } from "./os-version.model";

export class HomePageTabLoadingState extends Store.AbstractLoadingState< PageTable> {}
export class HomePageTabLoadingErrorState extends Store.AbstractErrorState<PageTable> {}
export class HomePageTabLoadedState extends Store.AbstractIdealState<PageTable> {}