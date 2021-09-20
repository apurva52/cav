import { Store } from 'src/app/core/store/store';
import { DashboardLayout } from '../../../service/dashboard.model';
import { DashboardLayoutDTO, LayoutCtx, Status } from './layout-manager.model';

export class DashboardLayoutCreatingState extends Store.AbstractLoadingState<DashboardLayout> {}
export class DashboardLayoutCreatingErrorState extends Store.AbstractErrorState<DashboardLayout> {}

export class DashboardLayoutLoadingState extends Store.AbstractLoadingState<DashboardLayoutDTO> {}
export class DashboardLayoutLoadingErrorState extends Store.AbstractErrorState<DashboardLayoutDTO> {}
export class DashboardLayoutLoadedState extends Store.AbstractIdealState<DashboardLayoutDTO> {}

export class DashboardLayoutSavingState extends Store.AbstractLoadingState<Status> {}
export class DashboardLayoutSavingErrorState extends Store.AbstractErrorState<Status> {}
export class DashboardLayoutSavedState extends Store.AbstractIdealState<Status> {}

export class DashboardLayoutDummyLoadingState extends Store.AbstractLoadingState<DashboardLayout[]> {}
export class DashboardLayoutDummyLoadingErrorState extends Store.AbstractErrorState<DashboardLayout[]> {}
export class DashboardLayoutDummyLoadedState extends Store.AbstractIdealState<DashboardLayout[]> {}

export class DashboardLayoutDeletingState extends Store.AbstractLoadingState<Status> {}
export class DashboardLayoutDeletingErrorState extends Store.AbstractErrorState<Status> {}
export class DashboardLayoutDeletedState extends Store.AbstractIdealState<Status> {}

export class DashboardLayoutCheckingState extends Store.AbstractLoadingState<Status> {}
export class DashboardLayoutCheckingErrorState extends Store.AbstractErrorState<Status> {}
export class DashboardLayoutCheckedState extends Store.AbstractIdealState<Status> {}
