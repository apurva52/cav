import { Store } from 'src/app/core/store/store';
// tslint:disable-next-line:quotemark
import { UserSegmentTable } from "./user-segment.model";

export class HomePageTabLoadingState extends Store.AbstractLoadingState<UserSegmentTable> { }
export class HomePageTabLoadingErrorState extends Store.AbstractErrorState<UserSegmentTable> { }
export class HomePageTabLoadedState extends Store.AbstractIdealState<UserSegmentTable> { }