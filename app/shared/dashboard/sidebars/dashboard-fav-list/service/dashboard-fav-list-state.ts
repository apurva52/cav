import { Store } from 'src/app/core/store/store';
// import { DashboardLayout } from '../../../service/dashboard.model';
import { MenuItem } from 'primeng/api';

// export class DashboardLayoutCreatingState extends Store.AbstractLoadingState<MenuItem[]> {}
// export class DashboardLayoutCreatingErrorState extends Store.AbstractErrorState<MenuItem[]> {}

export class DashboardFavListLoadingState extends Store.AbstractLoadingState<MenuItem[]> {}
export class DashboardFavListLoadingErrorState extends Store.AbstractErrorState<MenuItem[]> {}
export class DashboardFavListLoadedState extends Store.AbstractIdealState<MenuItem[]> {}
