
export class WidgetConfiguration  {
  margins?: number[];
  draggable?: boolean;
  resizable?: boolean;
  max_cols?: number;
  max_rows?: number;
  visible_cols?: number;
  visible_rows?: number;
  min_cols?: number;
  min_rows?: number;
  col_width?: number;
  row_height?: number;
  cascade?: string;
  min_width?: number;
  min_height?: number;
  fix_to_grid?: boolean;
  auto_style?: boolean;
  auto_resize?: boolean;
  maintain_ratio?: boolean;
  prefer_new?: boolean;
  zoom_on_drag?: boolean;
  limit_to_screen?: boolean;

  constructor() {

    /* Here we created the default configuration. */
    this.margins = [5];
    this.draggable = true;
    this.resizable = true;
    this.max_cols = 0;
    // this.max_rows = 100;  kanchan sir
    this.max_rows = 100;
    // this.visible_cols = 30; kanchan sir
    this.visible_cols = 30;
    this.visible_rows = 0;
    this.min_cols = 1;
    this.min_rows = 1;
    this.col_width = 2;
    // this.col_width = 34.15;
    this.row_height = 2;
    // this.row_height = 41.096774193548384;
    this.cascade = 'up';
    this.min_width = 50;
    this.min_height = 50;
    this.fix_to_grid = false;
    this.auto_style = true;
    this.auto_resize = false;
    this.maintain_ratio = false;
    this.prefer_new = false;
    this.zoom_on_drag = false;
    this.limit_to_screen = true;

  }
}
