import { Store } from 'src/app/core/store/store';
import { Status } from '../../service/alert.model';
import { Action, ActionResponse, ActionTable } from './alert-actions.model';

export class ActionDataLoadingState extends Store.AbstractLoadingState<ActionTable> {}
export class ActionDataLoadingErrorState extends Store.AbstractErrorState<ActionTable> {}
export class ActionDataLoadedState extends Store.AbstractIdealState<ActionTable> {}

export class ActionLoadingState extends Store.AbstractLoadingState<Action[]> {}
export class ActionLoadingErrorState extends Store.AbstractErrorState<Action[]> {}
export class ActionLoadedState extends Store.AbstractIdealState<Action[]> {}

export class ActionStateLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class ActionStateLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class ActionStateLoadedStatus extends Store.AbstractIdealState<Status> {}

export class ActionResponseLoadingState extends Store.AbstractLoadingState<ActionResponse> {}
export class ActionResponseLoadeErrorState extends Store.AbstractErrorState<ActionResponse> {}
export class ActionResponseLoadedState extends Store.AbstractIdealState<ActionResponse> {}

export class ActionArrayDeletingState extends Store.AbstractLoadingState<ActionResponse> {}
export class ActionArrayDeletingErrorState extends Store.AbstractErrorState<ActionResponse>{}
export class ActionArrayDeletedState extends Store.AbstractIdealState<ActionResponse>{}