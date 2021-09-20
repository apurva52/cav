
import { Store } from 'src/app/core/store/store';
import { ClusterMonitor } from 'src/app/pages/tools/actions/cluster-monitor/service/cluster-monitor.model';



export class ClusterMonitorLoadingState extends Store.AbstractLoadingState<ClusterMonitor> {}
export class ClusterMonitorLoadingErrorState extends Store.AbstractErrorState<ClusterMonitor> {}
export class ClusterMonitorLoadedState extends Store.AbstractIdealState<ClusterMonitor> {}

export class ClusterMonitorStateLoadingState extends Store.AbstractLoadingState<ClusterMonitor> {}
export class ClusterMonitorStateLoadingErrorState extends Store.AbstractErrorState<ClusterMonitor> {}
export class ClusterMonitorStateLoadedState extends Store.AbstractIdealState<ClusterMonitor> {}

export class ClusterMonitorStatsLoadingState extends Store.AbstractLoadingState<ClusterMonitor> {}
export class ClusterMonitorStatsLoadingErrorState extends Store.AbstractErrorState<ClusterMonitor> {}
export class ClusterMonitorStatsLoadedState extends Store.AbstractIdealState<ClusterMonitor> {}

export class IndicesStatsLoadingState extends Store.AbstractLoadingState<ClusterMonitor> {}
export class IndicesStatsLoadingErrorState extends Store.AbstractErrorState<ClusterMonitor> {}
export class IndicesStatsLoadedState extends Store.AbstractIdealState<ClusterMonitor> {}