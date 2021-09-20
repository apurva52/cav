import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowGraphInTreeComponent } from './show-graph-in-tree.component';
import {
  SidebarModule,
  SlideMenuModule,
  BreadcrumbModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  TreeModule,
  TooltipModule,
  MessageModule,
  CardModule,
  ContextMenuModule,
  ProgressSpinnerModule
} from 'primeng';
import { WidgetSubmenuModule } from './widget-submenu/widget-submenu.module';
import { FormsModule } from '@angular/forms';
import { TreeSubmenuModule } from './tree-submenu/tree-submenu.module';

const imports = [
  CommonModule,
  SidebarModule,
  SlideMenuModule,
  BreadcrumbModule,
  ButtonModule,
  TreeModule,
  CheckboxModule,
  TooltipModule,
  InputTextModule,
  DropdownModule,
  WidgetSubmenuModule,
  FormsModule,
  TreeSubmenuModule,
  MessageModule,
  CardModule,
  ContextMenuModule,
  ProgressSpinnerModule
];

const declarations = [ShowGraphInTreeComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class ShowGraphInTreeModule {}
