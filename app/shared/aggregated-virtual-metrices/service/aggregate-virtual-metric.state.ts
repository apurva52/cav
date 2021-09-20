import { Store } from 'src/app/core/store/store';
import { DashboardWidgetLoadRes } from './aggregated-virtual-metric.model';

export class derivedResCreatingState extends Store.AbstractLoadingState<DashboardWidgetLoadRes> { }
export class derivedResCreatingErrorState extends Store.AbstractErrorState<DashboardWidgetLoadRes> { }
export class derivedResCreatedState extends Store.AbstractIdealState<DashboardWidgetLoadRes> { }

