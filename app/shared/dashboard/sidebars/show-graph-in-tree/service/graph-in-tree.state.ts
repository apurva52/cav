import { MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { TreeResult } from './graph-in-tree.model';

export class GraphInTreeLoadingState extends Store.AbstractLoadingState<TreeResult[]> { }
export class GraphInTreeLoadingErrorState extends Store.AbstractErrorState<TreeResult[]> { }
export class GraphInTreeLoadedState extends Store.AbstractIdealState<TreeResult[]> { }

export class TreeWidgetMenuLoadingState extends Store.AbstractLoadingState<MenuItem[]> { }
export class TreeWidgetMenuLoadingErrorState extends Store.AbstractErrorState<MenuItem[]> { }
export class TreeWidgetMenuLoadedState extends Store.AbstractIdealState<MenuItem[]> { }

export class ColorSearchInTreeLoadingState extends Store.AbstractLoadingState<any> { }
export class ColorSearchInTreeLoadingErrorState extends Store.AbstractErrorState<any> { }
export class ColorSearchInTreeLoadedState extends Store.AbstractIdealState<any> { }

export class TreeOperationsLoadingState extends Store.AbstractLoadingState<any> { }
export class TreeOperationsLoadingErrorState extends Store.AbstractErrorState<any> { }
export class TreeOperationsLoadedState extends Store.AbstractIdealState<any> { }