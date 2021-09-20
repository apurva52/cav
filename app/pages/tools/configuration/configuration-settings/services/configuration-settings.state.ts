import { Store } from 'src/app/core/store/store';
import { ConfigSetting, ConfigResponse } from './configuration-settings.model';

export class ConfigSettingLoadingState extends Store.AbstractLoadingState<ConfigSetting[]>{}
export class ConfigSettingLoadingErrorState extends Store.AbstractLoadingState<ConfigSetting[]>{}
export class ConfigSettingLoadedState extends Store.AbstractLoadingState<ConfigSetting[]>{}

export class SetConfigSettingLoadingState extends Store.AbstractLoadingState<ConfigResponse[]>{}
export class SetConfigSettingLoadingErrorState extends Store.AbstractLoadingState<ConfigResponse[]>{}
export class SetConfigSettingLoadedState extends Store.AbstractLoadingState<ConfigResponse[]>{}
