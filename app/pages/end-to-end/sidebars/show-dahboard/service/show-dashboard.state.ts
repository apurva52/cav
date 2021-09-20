import { Store } from 'src/app/core/store/store';
import { ShowDashboard } from './show-dashboard.model';

export class EndToEndShowDashboardLoadingState extends Store.AbstractLoadingState<ShowDashboard> {}
export class EndToEndShowDashboardLoadingErrorState extends Store.AbstractErrorState<ShowDashboard> {}
export class EndToEndShowDashboardLoadedState extends Store.AbstractIdealState<ShowDashboard> {}