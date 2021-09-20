import { Store } from 'src/app/core/store/store';
import { WidgetDrillDownMenu } from './widget-menu.model';

export class WidgetDrillDownMenuLoadingState extends Store.AbstractLoadingState<WidgetDrillDownMenu> {}
export class WidgetDrillDownMenuLoadingErrorState extends Store.AbstractErrorState<WidgetDrillDownMenu> {}
export class WidgetDrillDownMenuLoadedState extends Store.AbstractIdealState<WidgetDrillDownMenu> {}
