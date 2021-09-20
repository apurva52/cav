import { Store } from 'src/app/core/store/store';
import { EndToEnd } from './end-to-end.model';

export class EndToEndDataLoadingState extends Store.AbstractLoadingState<EndToEnd> {}
export class EndToEndDataLoadingErrorState extends Store.AbstractErrorState<EndToEnd> {}
export class EndToEndDataLoadedState extends Store.AbstractIdealState<EndToEnd> {}