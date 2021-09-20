import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeInfoComponent } from './node-info.component';
import {
  ButtonModule,
  SidebarModule,
  TabViewModule,
  TooltipModule,
} from 'primeng';
import { NodeActionMenuModule } from '../../end-to-end-graphical/node-action-menu/node-action-menu.module';

const imports = [
  CommonModule,
  TooltipModule,
  ButtonModule,
  SidebarModule,
  TabViewModule,
  NodeActionMenuModule,
];

const components = [NodeInfoComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class NodeInfoModule {}
