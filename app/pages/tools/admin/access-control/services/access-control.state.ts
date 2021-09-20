import { Store } from 'src/app/core/store/store';
import { AccessControlTable, aclCompleteList } from './access-control.model';
import { getAllUserResponse, saveUserReq, saveUserGroupCapabilityRes } from './access-control.model';

export class AccessControlLoadingState extends Store.AbstractLoadingState<aclCompleteList> { }
export class AccessControlLoadingErrorState extends Store.AbstractErrorState<aclCompleteList> { }
export class AccessControlLoadedState extends Store.AbstractIdealState<aclCompleteList> { }

export class saveUserLoadingState extends Store.AbstractLoadingState<saveUserGroupCapabilityRes> { }
export class saveUserLoadingErrorState extends Store.AbstractErrorState<saveUserGroupCapabilityRes> { }
export class saveUserLoadedState extends Store.AbstractIdealState<saveUserGroupCapabilityRes> { }
