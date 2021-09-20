import { from } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import {QueryTable} from './query-settings.model'

export class QuerySettingsLoadingState extends Store.AbstractLoadingState<QueryTable> {}
export class QuerySettingsLoadingErrorState extends Store.AbstractErrorState<QueryTable> {}
export class QuerySettingsLoadedState extends Store.AbstractIdealState<QueryTable> {}

export class updateQuerySettingsLoadingState extends Store.AbstractLoadingState<QueryTable> {}
export class updateQuerySettingsLoadingErrorState extends Store.AbstractErrorState<QueryTable> {}
export class updateQuerySettingsLoadedState extends Store.AbstractIdealState<QueryTable> {}