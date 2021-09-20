import { Store } from 'src/app/core/store/store';
import { Status } from '../../service/alert.model';
import { AlertActionHistoryTable ,ActionHistoryRequest,ActionHistoryResponse,ActionHistory} from './alert-action-history.model';

export class AlertHistoryLoadingState extends Store.AbstractLoadingState<AlertActionHistoryTable> {}
export class AlertHistoryLoadingErrorState extends Store.AbstractErrorState<AlertActionHistoryTable> {}
export class AlertHistoryLoadedState extends Store.AbstractIdealState<AlertActionHistoryTable> {}