import { Store } from 'src/app/core/store/store';
import { DashboardServiceReq } from './dashboard-service-req.model';


export class DashboardServiceReqLoadingState extends Store.AbstractLoadingState<DashboardServiceReq[]> {}
export class DashboardServiceReqLoadingErrorState extends Store.AbstractErrorState<DashboardServiceReq[]> {}
export class DashboardServiceReqLoadedState extends Store.AbstractIdealState<DashboardServiceReq[]> {}
