import { Store } from 'src/app/core/store/store';
import { Status } from '../../service/alert.model';
import { MaintenanceRequest, MaintenanceResponse, MaintenanceTable } from './alert-maintenance.model';

export class MaintenanceDataLoadingState extends Store.AbstractLoadingState<MaintenanceTable> {}
export class MaintenanceDataLoadingErrorState extends Store.AbstractErrorState<MaintenanceTable> {}
export class MaintenanceDataLoadedState extends Store.AbstractIdealState<MaintenanceTable> {}

export class MaintenanceStateLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class MaintenanceStateLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class MaintenanceStateLoadedStatus extends Store.AbstractIdealState<Status> {}

export class MaintenanceAddLoadingState extends Store.AbstractLoadingState<MaintenanceRequest> {}
export class MaintenanceAddLoadingErrorState extends Store.AbstractErrorState<MaintenanceRequest> {}
export class MaintenanceAddLoadedState extends Store.AbstractIdealState<MaintenanceRequest> {}

export class MaintenanceEditLoadingState extends Store.AbstractLoadingState<MaintenanceRequest> {}
export class MaintenanceEditLoadingErrorState extends Store.AbstractErrorState<MaintenanceRequest> {}
export class MaintenanceEditLoadedState extends Store.AbstractIdealState<MaintenanceRequest> {}
