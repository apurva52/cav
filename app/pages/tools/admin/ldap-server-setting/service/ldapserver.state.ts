import { Store } from 'src/app/core/store/store';
import { responseForGit } from './ldapserver.model';

export class ldapServerSettingCreatingState extends Store.AbstractLoadingState<responseForGit> { }
export class ldapServerSettingCreatingErrorState extends Store.AbstractErrorState<responseForGit> { }
export class ldapServerSettingCreatedState extends Store.AbstractIdealState<responseForGit> { }