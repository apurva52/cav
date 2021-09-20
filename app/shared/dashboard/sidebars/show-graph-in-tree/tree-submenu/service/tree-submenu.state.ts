import { Store } from 'src/app/core/store/store';
import { MenuItem } from 'primeng';

export class TreeSubMenuLoadingState extends Store.AbstractLoadingState<MenuItem[]> {}
export class TreeSubMenuLoadingErrorState extends Store.AbstractErrorState<MenuItem[]> {}
export class TreeSubMenuLoadedState extends Store.AbstractIdealState<MenuItem[]> {}
