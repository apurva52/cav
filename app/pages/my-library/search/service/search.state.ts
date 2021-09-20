import { from } from 'rxjs';
import { Store } from 'src/app/core/store/store';


export class SavedSearchLoadingState extends Store.AbstractLoadingState<any> {}
export class SavedSearchLoadingErrorState extends Store.AbstractErrorState<any> {}
export class SavedSearchLoadedState extends Store.AbstractIdealState<any> {}
