import { ActionResponse } from './../../../alert-actions/service/alert-actions.model';
import { Store } from 'src/app/core/store/store';
import { GraphData, GroupData, RulePayload } from './alert-config.model';
import { DashboardWidgetLoadRes } from 'src/app/shared/dashboard/service/dashboard.model';


export class RuleDataLoadingState extends Store.AbstractLoadingState<RulePayload> { }
export class RuleDataLoadingErrorState extends Store.AbstractErrorState<RulePayload> { }
export class RuleDataLoadedState extends Store.AbstractIdealState<RulePayload> { }

export class GraphLoadingState extends Store.AbstractLoadingState<GraphData> { }
export class GraphLoadingErrorState extends Store.AbstractErrorState<GraphData> { }
export class GraphLoadedState extends Store.AbstractIdealState<GraphData> { }

export class GroupLoadingState extends Store.AbstractLoadingState<GroupData> { }
export class GroupLoadingErrorState extends Store.AbstractErrorState<GroupData> { }
export class GroupLoadedState extends Store.AbstractIdealState<GroupData> { }


export class ActionListLoadingState extends Store.AbstractLoadingState<ActionResponse> {}
export class ActionListLoadingErrorState extends Store.AbstractErrorState<ActionResponse> {}
export class ActionListLoadedState extends Store.AbstractIdealState<ActionResponse> {}

export class GenerateChartLoadingState extends Store.AbstractLoadingState<DashboardWidgetLoadRes> { }
export class GenerateChartLoadingErrorState extends Store.AbstractErrorState<DashboardWidgetLoadRes> { }
export class GenerateChartLoadedState extends Store.AbstractIdealState<DashboardWidgetLoadRes> { }