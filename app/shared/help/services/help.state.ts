import { Store } from 'src/app/core/store/store';
import { HelpContent } from './help.model';

export class HelpContentLoadingState extends Store.AbstractLoadingState<HelpContent> { }
export class HelpContentLoadingErrorState extends Store.AbstractErrorState<HelpContent> { }
export class HelpContentLoadedState extends Store.AbstractIdealState<HelpContent> { }
