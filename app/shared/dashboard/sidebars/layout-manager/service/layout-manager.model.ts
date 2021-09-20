import { AppError } from 'src/app/core/error/error.model';
import { Observable, Subject, interval } from 'rxjs';
import { TimebarTimeConfig } from '../../../../../shared/time-bar/service/time-bar.model';
import { ClientCTX } from 'src/app/core/session/session.model';
import { SelectItem } from 'primeng';
import { DashboardGalleryLayoutConfig , DashboardGridLayoutConfig} from '../../../service/dashboard.model';


/ * constant file used for obType */
export const SAVE_CUSTOM_LAYOUT : number = 12;
export const LOAD_CUSTOM_LAYOUT : number = 13;
export const DELETE_CUSTOM_LAYOUT : number = 14;
export const GET_ALL_LAYOUT : number = 15;
export const LAYOUT_SUCCESSFULY_SAVED : number = 152;
export const LAYOUT_SUCCESSFULY_DELETED : number = 154;
export const CHECK_CUSTOM_LAYOUT : number = 1;
export const DUPLICATE_LAYOUT_NAME : number = 151;
export const NO_LAYOUT_AVAILABLE :  number = 158;
export const OLD_GRID_MAP_ROW_HEIGHT = 30;

//Layout Configuration
export const GRID_ROWHEIGHT = 1;
export const GRID_MAXCOLS = 200;
export const WIDGETS_MARGIN = 5;
export const GALLERY_LAYOUT_MARGIN = 14; // 10 is a pixel in gallery layout between thumbnails and preview section nas 5 is widget margins
export interface LayoutCtx {
  layoutNameCtx?: LayoutNameCtx;
  layoutDetailCtx?: DashboardLayoutDTO;
  }

  export interface LayoutNameCtx {
    name: string;
    path: string;
  }

  export interface LayoutManagerWidgetLayout {
    cols: number;
    rows: number;
    x: number;
    y: number;
  }
  export interface DashboardLayoutRequestDTO {
    opType?: number;
    cctx?: ClientCTX;
    tr?: string;
    layoutCtx?: DashboardLayoutDTO;
    multiDc?: boolean;
  }

  export interface DashboardLayoutDTO{
      id?: string;
      type?: 'GRID' | 'GALLERY';
      name?: string;
      category?: string;
      icon?: string;
      configGrid?: DashboardGridLayoutConfig;
      configGallery?: DashboardGalleryLayoutConfig;
  }

  export interface DashboardLayoutRequest {
    opType?: number;
    cctx?:Object;
    tr?: string;
    multiDc?: boolean;
    layoutCtx?:LayoutCtx
  }
  
  export interface Status {
    code?: number;
    message?: string;
    detailedMesssage?: string;
  }