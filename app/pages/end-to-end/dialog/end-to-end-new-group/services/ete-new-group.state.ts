import { Store } from 'src/app/core/store/store';
import { EndToEndNewGroupData } from './ete-new-group.model';

export class EndToEndNewGroupDataLoadingState extends Store.AbstractLoadingState<EndToEndNewGroupData> {}
export class EndToEndNewGroupDataLoadingErrorState extends Store.AbstractErrorState<EndToEndNewGroupData> {}
export class EndToEndNewGroupDataLoadedState extends Store.AbstractIdealState<EndToEndNewGroupData> {}