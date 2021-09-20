import { Store } from 'src/app/core/store/store';
import { AlertRuleTable } from './alert-rules.model';

export class AlertRuleDataLoadingState extends Store.AbstractLoadingState<AlertRuleTable> { }
export class AlertRuleDataLoadingErrorState extends Store.AbstractErrorState<AlertRuleTable> { }
export class AlertRuleDataLoadedState extends Store.AbstractIdealState<AlertRuleTable> { }