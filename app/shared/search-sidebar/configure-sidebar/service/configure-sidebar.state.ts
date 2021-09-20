import { Store } from 'src/app/core/store/store';
import { ConfigureSidebarData } from './configure-sidebar.model';

export class ConfigureSidebarLoadingState extends Store.AbstractLoadingState<ConfigureSidebarData> {}
export class ConfigureSidebarLoadingErrorState extends Store.AbstractErrorState<ConfigureSidebarData> {}
export class ConfigureSidebarLoadedState extends Store.AbstractIdealState<ConfigureSidebarData> {}