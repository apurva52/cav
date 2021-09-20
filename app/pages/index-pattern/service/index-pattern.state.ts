import { Store } from 'src/app/core/store/store';
import { IndexPatternTable } from './index-pattern.model';

export class IndexPatternLoadingState extends Store.AbstractLoadingState<IndexPatternTable> { }
export class IndexPatternLoadingErrorState extends Store.AbstractErrorState<IndexPatternTable> { }
export class IndexPatternLoadedState extends Store.AbstractIdealState<IndexPatternTable> { }
