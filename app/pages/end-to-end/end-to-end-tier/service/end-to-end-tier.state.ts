import { Store } from 'src/app/core/store/store';
import { EndToEndTierData } from './end-to-end-tier.model';

export class EndToEndTierLoadingState extends Store.AbstractLoadingState<EndToEndTierData> {}
export class EndToEndTierLoadingErrorState extends Store.AbstractErrorState<EndToEndTierData> {}
export class EndToEndTierLoadedState extends Store.AbstractIdealState<EndToEndTierData> {}