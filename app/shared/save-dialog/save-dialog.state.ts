import { from } from 'rxjs';
import { Store } from 'src/app/core/store/store';

export class SaveSearchLoadingState extends Store.AbstractLoadingState<any> {}
export class SaveSearchLoadingErrorState extends Store.AbstractErrorState<any> {}
export class SaveSearchLoadedState extends Store.AbstractIdealState<any> {}
