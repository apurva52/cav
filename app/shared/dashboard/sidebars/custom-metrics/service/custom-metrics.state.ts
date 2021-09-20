import { MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { DashboardWidgetLoadRes, DeleteDerivedData, graphData, groupData, hierarchicalData, ViewDerivedExpData } from './custom-metrics.model';


export class derivedGraphCreatingState extends Store.AbstractLoadingState<graphData> { }
export class derivedGraphCreatingErrorState extends Store.AbstractErrorState<graphData> { }
export class derivedGraphCreatedState extends Store.AbstractIdealState<graphData> { }

export class derivedGroupCreatingState extends Store.AbstractLoadingState<groupData> { }
export class derivedGroupCreatingErrorState extends Store.AbstractErrorState<groupData> { }
export class derivedGroupCreatedState extends Store.AbstractIdealState<groupData> { }


export class derivedResCreatingState extends Store.AbstractLoadingState<DashboardWidgetLoadRes> { }
export class derivedResCreatingErrorState extends Store.AbstractErrorState<DashboardWidgetLoadRes> { }
export class derivedResCreatedState extends Store.AbstractIdealState<DashboardWidgetLoadRes> { }

export class hierarchialDataCreatingState extends Store.AbstractLoadingState<hierarchicalData> { }
export class hierarchialDataCreatingErrorState extends Store.AbstractErrorState<hierarchicalData> { }
export class hierarchialDataCreatedState extends Store.AbstractIdealState<hierarchicalData> { }

export class derivedMenuLoadedState extends Store.AbstractLoadingState<MenuItem[]> { }
export class derivedMenuLoadingErrorState extends Store.AbstractErrorState<MenuItem[]> { }
export class derivedMenuLoadingState extends Store.AbstractIdealState<MenuItem[]> { }

export class deleteDerivedCreatingState extends Store.AbstractLoadingState<DeleteDerivedData> { }
export class deleteDerivedCreatingErrorState extends Store.AbstractErrorState<DeleteDerivedData> { }
export class deleteDerivedCreatedState extends Store.AbstractIdealState<DeleteDerivedData> { }

export class viewDerivedExpCreatingState extends Store.AbstractLoadingState<ViewDerivedExpData> { }
export class viewDerivedExpCreatingErrorState extends Store.AbstractErrorState<ViewDerivedExpData> { }
export class viewDerivedExpCreatedState extends Store.AbstractIdealState<ViewDerivedExpData> { }
