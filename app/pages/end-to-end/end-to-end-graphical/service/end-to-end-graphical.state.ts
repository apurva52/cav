import { Store } from 'src/app/core/store/store';
import { EndToEndGraphical } from './end-to-end-graphical.model';

export class EndToEndGraphicalDataLoadingState extends Store.AbstractLoadingState<EndToEndGraphical> {}
export class EndToEndGraphicalDataLoadingErrorState extends Store.AbstractErrorState<EndToEndGraphical> {}
export class EndToEndGraphicalDataLoadedState extends Store.AbstractIdealState<EndToEndGraphical> {}