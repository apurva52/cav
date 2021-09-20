import { Store } from 'src/app/core/store/store';
import { multiNodeConfigTable } from './multi-node-configuration.model';

export class MultiNodeConfigurationLoadingState extends Store.AbstractLoadingState<any> {}
export class MultiNodeConfigurationErrorState extends Store.AbstractErrorState<any> {}
export class MultiNodeConfigurationLoadedState extends Store.AbstractIdealState<any> {}
