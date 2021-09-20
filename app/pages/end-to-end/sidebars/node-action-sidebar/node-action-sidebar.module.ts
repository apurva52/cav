import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeActionSidebarComponent } from './node-action-sidebar.component';
import {
  TooltipModule,
  ButtonModule,
  TabViewModule,
  SidebarModule,
} from 'primeng';
import { NodeRepresentationModule } from '../node-representation/node-representation.module';
import { TopTransactionModule } from '../top-transaction/top-transaction.module';
import { ShowDashboardModule } from '../show-dahboard/show-dahboard.module';
import { NodeInfoModule } from '../node-info/node-info.module';
import { NodeActionMenuModule } from '../../end-to-end-graphical/node-action-menu/node-action-menu.module';
import { SearchSidebarModule } from 'src/app/shared/search-sidebar/search-sidebar/search-sidebar.module';

const imports = [
  CommonModule,
  TooltipModule,
  ButtonModule,
  SidebarModule,
  NodeActionMenuModule,
  NodeRepresentationModule,
  TopTransactionModule,
  ShowDashboardModule,
  NodeInfoModule,
  SearchSidebarModule
];

const declarations = [NodeActionSidebarComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class NodeActionSidebar {}
