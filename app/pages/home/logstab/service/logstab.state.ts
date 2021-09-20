import { from } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {LogsData} from './logstab.model'

export class LogsLoadingState extends Store.AbstractLoadingState<LogsData> {}
export class LogsLoadingErrorState extends Store.AbstractErrorState<LogsData> {}
export class LogsLoadedState extends Store.AbstractIdealState<LogsData> {}

export class AggDataLoadingState extends Store.AbstractLoadingState<LogsData> {}
export class AggDataLoadingErrorState extends Store.AbstractErrorState<LogsData> {}
export class AggDataLoadedState extends Store.AbstractIdealState<LogsData> {}

export class FieldsDataLoadingState extends Store.AbstractLoadingState<LogsData> {}
export class FieldsDataLoadingErrorState extends Store.AbstractErrorState<LogsData> {}
export class FieldsDataLoadedState extends Store.AbstractIdealState<LogsData> {}