import { Store } from 'src/app/core/store/store';
import {DynamicLoggingTable} from './dynamic-logging.model';

export class DynamicLoggingLoadingState extends Store.AbstractLoadingState<DynamicLoggingTable> { }
export class DynamicLoggingLoadingErrorState extends Store.AbstractErrorState<DynamicLoggingTable> { }
export class DynamicLoggingLoadedState extends Store.AbstractIdealState<DynamicLoggingTable> { }
