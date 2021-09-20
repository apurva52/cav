import { Store } from 'src/app/core/store/store';
import { DashboardFavCTX, DashboardWidgetLoadRes } from './dashboard.model';
import { Subscription } from 'rxjs';

export class DashboardCreatingState extends Store.AbstractLoadingState<DashboardFavCTX> {}
export class DashboardCreatingErrorState extends Store.AbstractErrorState<DashboardFavCTX> {}

export class DashboardLoadingState extends Store.AbstractLoadingState<DashboardFavCTX> {}
export class DashboardLoadingErrorState extends Store.AbstractErrorState<DashboardFavCTX> {}
export class DashboardLoadedState extends Store.AbstractIdealState<DashboardFavCTX> {}

export class DashboardUpdatingState extends Store.AbstractLoadingState<void> {}
export class DashboardUpdatingErrorState extends Store.AbstractErrorState<void> {}
export class DashboardUpdatedState extends Store.AbstractIdealState<void> {}

export class DashboardWidgetLoadingSubscriptionState extends Store.AbstractLoadingState<Subscription> {}
export class DashboardWidgetLoadingState extends Store.AbstractLoadingState<DashboardWidgetLoadRes> {}
export class DashboardWidgetLoadingErrorState extends Store.AbstractErrorState<DashboardWidgetLoadRes> {}
export class DashboardWidgetLoadedState extends Store.AbstractIdealState<DashboardWidgetLoadRes> {}
