import { Store } from 'src/app/core/store/store';
import { Theme } from './color-theme.model';

export class ThemeLoadingState extends Store.AbstractLoadingState<Theme[]> {}
export class ThemeLoadingErrorState extends Store.AbstractErrorState<Theme[]> {}
export class ThemeLoadedState extends Store.AbstractIdealState<Theme[]> {}
