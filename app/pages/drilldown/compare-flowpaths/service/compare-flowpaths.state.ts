import { Store } from 'src/app/core/store/store';
import { CompareFlowPathData } from './compare-flowpaths.model';

export class CompareFlowPathLoadingState extends Store.AbstractLoadingState<CompareFlowPathData> { }
export class CompareFlowPathLoadingErrorState extends Store.AbstractErrorState<CompareFlowPathData> { }
export class CompareFlowPathLoadedState extends Store.AbstractIdealState<CompareFlowPathData> { }
