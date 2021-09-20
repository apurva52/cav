import { Store } from 'src/app/core/store/store';
import { KPIPre, KPIOrderRevenueData, KPIData } from './kpi.model';


export class KPIPreLoadingState extends Store.AbstractLoadingState<KPIPre> {}
export class KPIPreLoadingErrorState extends Store.AbstractErrorState<KPIPre> {}
export class KPIPreLoadedState extends Store.AbstractIdealState<KPIPre> {}

export class KPIORDataLoadingState extends Store.AbstractLoadingState<KPIOrderRevenueData> {}
export class KPIORDataLoadingErrorState extends Store.AbstractErrorState<KPIOrderRevenueData> {}
export class KPIORDataLoadedState extends Store.AbstractIdealState<KPIOrderRevenueData> {}

export class KPIDataLoadingState extends Store.AbstractLoadingState<KPIData> {}
export class KPIDataLoadingErrorState extends Store.AbstractErrorState<KPIData> {}
export class KPIDataLoadedState extends Store.AbstractIdealState<KPIData> {}

