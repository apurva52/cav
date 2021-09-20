import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, SlideMenuModule, TieredMenuModule } from 'primeng';
import { TreeSubmenuComponent } from './tree-submenu.component';
export interface TreeResult {
  children?: TreeResult[];
  hasChildren: boolean;
  graphID: number | null;
  groupID: number | null;
  groupTypeVector: boolean;
  lastHierarchicalComponent: boolean;
  matched: boolean;
  metricsName: string | null;
  nodeType: 0 | 1 | 2 | 3;
  specialNode: boolean;
  state: 'OPENED' | 'DISABLED' | 'SELECTED';
  text: string;
  type: string;
}


export type TreeLevel = 'ALL' | 'GROUP' | 'GRAPH' | 'VECTOR';

export interface TreeRequestPayload {
  toSearch?: string | null;
  paths?: string[] | null;
  level?: TreeLevel;
  groupID?: number;
  vectorName?: string;
}

export interface TreeInitRequestPayload {
  opType?: number,
  cctx?: any,
  tr?: string,
  duration?: Duration,
  clientId?: string,
  appId?: string,
  mgId?: number
}

export interface Duration {
  st?: number,
  et?: number,
  preset?: string,
}

export interface TreeNodeMenu {
  tree?: any;
  children?: TreeNodeMenu[];
  parent?: TreeNodeMenu;
  typeId?: number;
  name?: string;
  gdfId?: number;
  id?: string;
  matched?: boolean;
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  leaf?: boolean;
  expanded?: boolean;
  type?: string;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  key?: string;
  showMenu? : boolean;
  showSecondLevelMenu?: boolean;
}


@NgModule({
  declarations: [TreeSubmenuComponent],
  imports: [
    CommonModule,
    ButtonModule,
    SlideMenuModule,
    TieredMenuModule
  ],
  exports:[TreeSubmenuComponent]
})
export class TreeSubmenuModule { }
