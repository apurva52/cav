import { Store } from 'src/app/core/store/store';
import { ParametersData } from './alert.model';

export class HierarchialDataLoadingState extends Store.AbstractLoadingState<ParametersData> { }
export class HierarchialDataLoadingErrorState extends Store.AbstractErrorState<ParametersData> { }
export class HierarchialDataLoadedState extends Store.AbstractIdealState<ParametersData> { }
