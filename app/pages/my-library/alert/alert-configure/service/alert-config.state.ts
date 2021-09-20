import { Store } from 'src/app/core/store/store';
import { Status } from '../../service/alert.model';
import { Config, ConfigResponse } from './alert-config.model';

export class ConfigDataLoadingState extends Store.AbstractLoadingState<ConfigResponse> {}
export class ConfigDataLoadingErrorState extends Store.AbstractErrorState<ConfigResponse> {}
export class ConfigDataLoadedState extends Store.AbstractIdealState<ConfigResponse> {}

export class ConfigStateLoadingStatus extends Store.AbstractLoadingState<Status> {}
export class ConfigStateLoadingErrorStatus extends Store.AbstractLoadingState<Status> {}
export class ConfigStateLoadedStatus extends Store.AbstractIdealState<Status> {}
