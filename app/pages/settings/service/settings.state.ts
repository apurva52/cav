import { Store } from 'src/app/core/store/store';
import { Credentials, MailSMSConfigResponse } from './settings.model';

export class ChangePasswordLoadingState extends Store.AbstractLoadingState<Credentials> { }
export class ChangePasswordLoadingErrorState extends Store.AbstractErrorState<Credentials> { }
export class ChangePasswordLoadedState extends Store.AbstractIdealState<Credentials> { }

export class MailSMSSettingLoadingState extends Store.AbstractLoadingState<MailSMSConfigResponse> { }
export class MailSMSSettingLoadingErrorState extends Store.AbstractErrorState<MailSMSConfigResponse> { }
export class MailSMSSettingLoadedState extends Store.AbstractIdealState<MailSMSConfigResponse> { }
