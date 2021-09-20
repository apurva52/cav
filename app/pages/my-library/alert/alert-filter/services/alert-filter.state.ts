import { Store } from 'src/app/core/store/store';
import { AlertRuleTable } from '../../alert-rules/service/alert-rules.model';
import { EventResponse } from '../../service/alert-table.model';


export class AlertFilterLoadingStatus extends Store.AbstractLoadingState<EventResponse> {}
export class AlertFilterLoadingErrorStatus extends Store.AbstractLoadingState<EventResponse> {}
export class AlertFilterLoadedStatus extends Store.AbstractIdealState<EventResponse> {}

export class AlertRuleDataLoadingState extends Store.AbstractLoadingState<AlertRuleTable> {}
export class AlertRuleDataLoadingErrorState extends Store.AbstractLoadingState<AlertRuleTable> {}
export class AlertRuleDataLoadedState extends Store.AbstractIdealState<AlertRuleTable> {}