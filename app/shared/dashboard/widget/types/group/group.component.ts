import {
  Component,
  HostBinding,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';
import {
  DashboardGroupWidgetConfig,
  DashboardLayoutMode,
  DashboardWidgetLayout,
  DashboardWidgetTypeDataConfig,
} from '../../../service/dashboard.model';
import * as _ from 'lodash';
import { CompactType, DirTypes, DisplayGrid, GridsterComponent, GridsterConfig, GridType } from 'angular-gridster2';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: GroupComponent }
  ],
})

export class GroupComponent extends DashboardWidgetComponent {
  @HostBinding('class') class = 'widget-container widget-group';

  groupOptions: DashboardGroupWidgetConfig;

  config: GridsterConfig = null;

  @ViewChild(GridsterComponent, { read: GridsterComponent })
  gridseter: GridsterComponent;

  @ViewChildren(DashboardWidgetComponent) widgets: QueryList<DashboardWidgetComponent>;

  private resizeWidgetTimeout: NodeJS.Timeout;
  private renderWidgetTimeout: NodeJS.Timeout;
  private detectOptionsChangeTimeout: NodeJS.Timeout;

  private containerRect = null;
  private containerRectVH: number = null;
  @Input() visiblityMenu : any;
  defaultWidgetLayout = {
    x: null,
    y: null,
    cols: 6,
    rows: 5,
  };

  type: string = 'GRID';

  render() {
    const me = this;
    me.groupOptions = me.widget.settings.types.group;
    me.toggleMode(me.layout.mode)
    
    if (me.gridseter && me.gridseter.el) {
      me.gridseter.el.onscroll = () => {
        me.renderWidgets();
      };
      if(me.dashboard.updateGroupDashboard) {
        me.renderWidgets(true, true)
      }
    } else {
      console.error('Gridster init failed');
    }
    setTimeout(() => {
      me.cd.detectChanges();
    });
  }

  init() {
    const me = this;
    const config: GridsterConfig = {
      gridType: GridType.VerticalFixed,
      // 'fit' will fit the items in the container without scroll;
      // 'scrollVertical' will fit on width and height of the items will be the same as the width
      // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
      // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
      // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
      // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
      fixedColWidth: 50, // fixed col width for gridType: 'fixed'
      fixedRowHeight: 30, // fixed row height for gridType: 'fixed'
      keepFixedHeightInMobile: false, // keep the height from fixed gridType in mobile layout
      keepFixedWidthInMobile: false, // keep the width from fixed gridType in mobile layout
      setGridSize: false, // sets grid size depending on content
      compactType: CompactType.None, // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
      mobileBreakpoint: 240, // if the screen is not wider that this, remove the grid layout and stack the items
      allowMultiLayer: true,
      defaultLayerIndex: 1,
      baseLayerIndex: 2,
      maxLayerIndex: 2,
      minCols: 1, // minimum amount of columns in the grid
      maxCols: 32, // maximum amount of columns in the grid
      minRows: 1, // minimum amount of rows in the grid
      maxRows: 10000, // maximum amount of rows in the grid
      defaultItemCols: 1, // default width of an item in columns
      defaultItemRows: 1, // default height of an item in rows
      maxItemCols: 50, // max item number of cols
      maxItemRows: 50, // max item number of rows
      minItemCols: 1, // min item number of columns
      minItemRows: 1, // min item number of rows
      minItemArea: 1, // min item area: cols * rows
      maxItemArea: 2500, // max item area: cols * rows
      margin: 5, // margin between grid items
      outerMargin: true, // if margins will apply to the sides of the container
      outerMarginTop: null, // override outer margin for grid
      outerMarginRight: null, // override outer margin for grid
      outerMarginBottom: null, // override outer margin for grid
      outerMarginLeft: null, // override outer margin for grid
      useTransformPositioning: true, // toggle between transform or top/left positioning of items
      scrollSensitivity: 10, // margin of the dashboard where to start scrolling
      scrollSpeed: 20, // how much to scroll each mouse move when in the scrollSensitivity zone
      initCallback: undefined, // callback to call after grid has initialized. Arguments: gridsterComponent
      destroyCallback: undefined, // callback to call after grid has destroyed. Arguments: gridsterComponent
      gridSizeChangedCallback: undefined, // callback to call after grid has changed size. Arguments: gridsterComponent
      itemChangeCallback: undefined, // callback to call for each item when is changes x, y, rows, cols.
      // Arguments: gridsterItem, gridsterItemComponent
      itemResizeCallback: () => {
        me.resizeWidget();
      }, // callback to call for each item when width/height changes.
      // Arguments: gridsterItem, gridsterItemComponent
      itemInitCallback: undefined, // callback to call for each item when is initialized.
      // Arguments: gridsterItem, gridsterItemComponent
      itemRemovedCallback: undefined, // callback to call for each item when is initialized.
      // Arguments: gridsterItem, gridsterItemComponent
      itemValidateCallback: undefined, // callback to call to validate item position/size. Return true if valid.
      // Arguments: gridsterItem
      enableEmptyCellClick: false, // enable empty cell click events
      enableEmptyCellCTXMenu: false, // enable empty cell context menu (right click) events
      enableEmptyCellDrop: false, // enable empty cell drop events
      enableEmptyCellDrag: false, // enable empty cell drag events
      enableOccupiedCellDrop: false, // enable occupied cell drop events
      emptyCellClickCallback: undefined, // empty cell click callback
      emptyCellCTXMenuCallback: undefined, // empty cell context menu (right click) callback
      emptyCellDropCallback: undefined, // empty cell drag drop callback. HTML5 Drag & Drop
      emptyCellDragCallback: undefined, // empty cell drag and create item like excel cell selection
      emptyCellDragMaxCols: 50, // limit empty cell drag max cols
      emptyCellDragMaxRows: 50, // limit empty cell drag max rows
      // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
      ignoreMarginInRow: false, // ignore the gap between rows for items which span multiple rows (see #162, #224)
      draggable: {
        delayStart: 0, // milliseconds to delay the start of drag, useful for touch interaction
        enabled: true, // enable/disable draggable items
        ignoreContentClass: 'gridster-item-content', // default content class to ignore the drag event from
        ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
        dragHandleClass: 'drag-handler', // drag event only from this class. If `ignoreContent` is true.
        stop: undefined, // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
        start: undefined, // callback when dragging an item starts.
        // Arguments: item, gridsterItem, event
        dropOverItems: false, // enable drop items on top other item
        dropOverItemsCallback: undefined, // callback on drop over another item
        // Arguments: source, target, gridComponent
      },
      resizable: {
        delayStart: 0, // milliseconds to delay the start of resize, useful for touch interaction
        enabled: true, // enable/disable resizable items
        handles: {
          s: true,
          e: true,
          n: true,
          w: true,
          se: true,
          ne: true,
          sw: true,
          nw: true,
        }, // resizable edges of an item
        stop: undefined, // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
        start: undefined, // callback when resizing an item starts.
        // Arguments: item, gridsterItem, event
      },
      swap: true, // allow items to switch position if drop on top of another
      swapWhileDragging: false, // allow items to switch position while dragging
      pushItems: true, // push items when resizing and dragging
      disablePushOnDrag: false, // disable push on drag
      disablePushOnResize: false, // disable push on resize
      pushDirections: { north: false, east: true, south: true, west: true }, // control the directions items are pushed
      pushResizeItems: false, // on resize of item will shrink adjacent items
      displayGrid: DisplayGrid.Always, // display background grid of rows and columns
      disableWindowResize: false, // disable the window on resize listener. This will stop grid to recalculate on window resize.
      disableWarnings: false, // disable console log warnings about misplacement of grid items
      scrollToNewItems: true, // scroll to new items placed in a scrollable view
      disableScrollHorizontal: false, // disable horizontal scrolling
      disableScrollVertical: false, // disable vertical scrolling
      disableAutoPositionOnConflict: false, // disable auto-position of items on conflict state,
      dirType: DirTypes.LTR, // page direction, rtl=right to left ltr= left to right, if you use rtl language set dirType to rtl
    };
    me.config = config;
    me.updateModeOptions();
    me.toggleMode(me.layout.mode)
    me.groupOptions = me.widget.settings.types.group;
  }

  renderWidgets(force?: boolean, clearData?: boolean) {
    const me = this;

    if (me.renderWidgetTimeout) {
      clearTimeout(me.renderWidgetTimeout);
    }

    if (!me.gridseter || (me.gridseter && !me.gridseter.el)) {
      return;
    }

    me.gridseter.onResize;

    me.containerRect = me.gridseter.el.getBoundingClientRect();
    me.containerRectVH = me.containerRect.top + me.containerRect.height;
    if (me.layout.dashboardComponent.selectedWidget.widget.isWidgetWiseCompare) {
      me.renderWidgetTimeout = setTimeout(() => {
        const currentTime = new Date().valueOf();
        const ttl = me.sessionService.getInterval('progressInterval');
        for (const c of me.widgets) {
          const isVisible = me.isWidgetIntoView(c);
          const isTime =
            isVisible &&
            ((c.lastLoadedAt ? currentTime - c.lastLoadedAt >= ttl : true) ||
              force);
          if (clearData) {
            c.clear();
          }

          setTimeout(() => {
            c.element.nativeElement.setAttribute(
              'visible',
              isVisible ? '1' : '0'
            );
            if (isTime && c.widget.isCompareData && c.isSelected) {
              c.load();
              me.cd.detectChanges();
            }
          });
        }
      }, 300);
    } else {
      me.renderWidgetTimeout = setTimeout(() => {
        // TODO: remove duplicate logic
        if (me.widgets.length && !me.layout.dashboardComponent.selectedWidget) {
          me.layout.dashboardComponent.selectWidget(me.widgets[0], true);
        }

        const currentTime = new Date().valueOf();
        const ttl = me.sessionService.getInterval('progressInterval');

        for (const c of me.widgets) {
          const isVisible = me.isWidgetIntoView(c);
          const isTime =
            isVisible &&
            ((c.lastLoadedAt ? currentTime - c.lastLoadedAt >= ttl : true) ||
              force);

          //zoom special handling to stop sample update calls until zoom is applied
          let isZoom = false;
          if (c.widget.zoomInfo && c.widget.zoomInfo.isZoom)
            isZoom = c.widget.zoomInfo.isZoom;

          if (clearData) {
            c.clear();
          }

          // Performance
          setTimeout(() => {
            c.element.nativeElement.setAttribute(
              'visible',
              isVisible ? '1' : '0'
            );
            if (isTime && !isZoom) {
              c.load();
              me.cd.detectChanges();
            }
          });
        }
      }, 300);
    }
  }

  private isWidgetIntoView(c: DashboardWidgetComponent): boolean {
    const me = this;
    const widgetRect = c.element.nativeElement.getBoundingClientRect();

    const intersects: boolean =
      widgetRect.top <= me.containerRectVH &&
      me.containerRect.top <= widgetRect.top + widgetRect.height;
    return intersects;
  }

  private resizeWidget() {
    const me = this;

    if (me.resizeWidgetTimeout) {
      clearTimeout(me.resizeWidgetTimeout);
    }

    me.resizeWidgetTimeout = setTimeout(() => {
      for (const c of me.widgets) {
        c.resize();
      }
    }, 200);
  }

  toggleMode(mode?: DashboardLayoutMode) {
    const me = this;

    if (mode) {
      me.mode = mode;
      setTimeout(() => {
        me.modeChange();
      });
      return;
    }

    if (me.mode === 'VIEW') {
      me.mode = 'EDIT';
      setTimeout(() => {
        me.modeChange();
      });
      return;
    }

    if (me.mode === 'EDIT') {
      me.mode = 'VIEW';
      setTimeout(() => {
        me.modeChange();
      });
      return;
    }
  }

  changeLayout() {
    const me = this;
    me.detectOptionsChange();
  }

  toggleWidgetFullScreen(widget: DashboardWidgetComponent) {}

  private modeChange() {
    const me = this;

    me.updateModeOptions();

    me.detectOptionsChange();
  }

  private updateModeOptions() {
    const me = this;
    if (me.mode === 'VIEW') {
      // View Mode
      me.config.draggable.enabled = false;
      me.config.resizable.enabled = false;
      me.config.pushItems = false;
      me.config.displayGrid = DisplayGrid.None;
      me.config.minCols = 1;
    } else {
      // Edit Mode
      me.config.draggable.enabled = true;
      me.config.resizable.enabled = true;
      me.config.pushItems = true;
      me.config.displayGrid = DisplayGrid.Always;
      me.config.minCols = me.groupOptions.layout.configGrid.cols;
    }
    me.detectOptionsChange();
  }

  public detectOptionsChange() {
    const me = this;

    if (me.detectOptionsChangeTimeout) {
      clearTimeout(me.detectOptionsChangeTimeout);
    }

    me.detectOptionsChangeTimeout = setTimeout(() => {
      if (me.gridseter) {
        me.gridseter.optionsChanged();
      }
    }, 500);
  }

  // Overridden in child
  onLayoutChange() {
    const me = this;

    me.widgets.forEach((widget: DashboardWidgetComponent, index: number) => {
      if (widget instanceof LabelComponent) {
        return;
      }
      const layout: DashboardWidgetLayout = this.getLayoutForWidgetAtIndex(
        index
      );
      widget.widget.layout = layout;
    });
  }

  getLayoutForWidgetAtIndex(index: number): DashboardWidgetLayout {
    const me = this;

    const widgetLayouts: Array<DashboardWidgetLayout> = _.get(
      me.dashboard,
      'favDetailCtx.layout.configGrid.widgetLayouts'
    );

    if (widgetLayouts && widgetLayouts.length) {
      return widgetLayouts[index % widgetLayouts.length];
    } else {
      return me.getDefaultLayoutForWidget();
    }
  }

  getDefaultLayoutForWidget(): DashboardWidgetLayout {
    return {
      cols: 5,
      rows: 3,
      x: null,
      y: null,
    };
  }
}
