import { Store } from 'src/app/core/store/store';
import { responseForGit } from './gitconfig.model';

export class gitConfigCreatingState extends Store.AbstractLoadingState<responseForGit> { }
export class gitConfigCreatingErrorState extends Store.AbstractErrorState<responseForGit> { }
export class gitConfigCreatedState extends Store.AbstractIdealState<responseForGit> { }