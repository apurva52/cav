import { Store } from 'src/app/core/store/store';
import { groupData, graphData, DashboardWidgetLoadRes } from './derived-metric.model';

export class derivedGraphCreatingState extends Store.AbstractLoadingState<graphData> { }
export class derivedGraphCreatingErrorState extends Store.AbstractErrorState<graphData> { }
export class derivedGraphCreatedState extends Store.AbstractIdealState<graphData> { }

export class derivedGroupCreatingState extends Store.AbstractLoadingState<groupData> { }
export class derivedGroupCreatingErrorState extends Store.AbstractErrorState<groupData> { }
export class derivedGroupCreatedState extends Store.AbstractIdealState<groupData> { }


export class derivedResCreatingState extends Store.AbstractLoadingState<DashboardWidgetLoadRes> { }
export class derivedResCreatingErrorState extends Store.AbstractErrorState<DashboardWidgetLoadRes> { }
export class derivedResCreatedState extends Store.AbstractIdealState<DashboardWidgetLoadRes> { }
