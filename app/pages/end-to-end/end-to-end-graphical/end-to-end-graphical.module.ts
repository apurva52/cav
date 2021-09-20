import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndToEndGraphicalComponent } from './end-to-end-graphical.component';
import { RouterModule, Routes } from '@angular/router';
import {
  ToolbarModule,
  ButtonModule,
  MessageModule,
  CarouselModule,
  DropdownModule,
  CheckboxModule,
  OverlayPanelModule,
  MenuModule,
  BreadcrumbModule,
  InputTextModule,
  MenubarModule,
  AutoCompleteModule,
  TieredMenuModule,
  PickListModule,
  DialogModule,
  TableModule,
  CardModule,
  TooltipModule, MultiSelectModule, RadioButtonModule, SliderModule
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { NodeActionSidebar } from '../sidebars/node-action-sidebar/node-action-sidebar.module';
import { FormsModule } from '@angular/forms';
import { NodeActionMenuModule } from './node-action-menu/node-action-menu.module';
import { SpecifiedTimeModule } from '../../drilldown/transactions-trend/specified-time/specified-time.module';
import { ShowDashboardModule } from '../sidebars/show-dahboard/show-dahboard.module';
import { ConfigureSidebarModule } from 'src/app/shared/search-sidebar/configure-sidebar/configure-sidebar.module';
import { SearchSidebarModule } from 'src/app/shared/search-sidebar/search-sidebar/search-sidebar.module';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { CallDetailsModule } from '../dialog/call-details/call-details.module';
import { RenameIntegrationModule } from '../dialog/rename-integration/rename-integration.module';
import { MapIntegrationModule } from '../dialog/map-integration/map-integration.module';
import { RenameMultipleIntegrationModule } from '../dialog/rename-multiple-integration/rename-multiple-integration.module';
import { ResetIntegrationModule } from '../dialog/reset-integration/reset-integration.module';
import { EndToEndNewGroupModule } from '../dialog/end-to-end-new-group/end-to-end-new-group.module';
import { NodeInfoModule } from '../sidebars/node-info/node-info.module';
import { NodeRepresentationModule } from '../sidebars/node-representation/node-representation.module';
import { TopTransactionModule } from '../sidebars/top-transaction/top-transaction.module';
import { EteTimeFilterModule } from 'src/app/shared/ete-time-filter/ete-time-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  MessageModule,
  NodeActionSidebar,
  CarouselModule,
  DropdownModule,
  FormsModule,
  CheckboxModule,
  OverlayPanelModule,
  MenuModule,
  BreadcrumbModule,
  EndToEndNewGroupModule,
  InputTextModule,
  NodeActionMenuModule,
  AutoCompleteModule,
  TieredMenuModule,
  SpecifiedTimeModule,
  ShowDashboardModule,
  ConfigureSidebarModule,
  SearchSidebarModule,
  PickListModule,
  DialogModule,
  TableModule,
  CardModule,
  TimeBarModule,
  TooltipModule,
  jsPlumbToolkitModule,
  CallDetailsModule,
  MapIntegrationModule,
  ResetIntegrationModule,
  RenameMultipleIntegrationModule,
  RenameIntegrationModule,
  NodeInfoModule,
  NodeRepresentationModule,
  TopTransactionModule,
  EteTimeFilterModule,
  PipeModule,
  MultiSelectModule,
  RadioButtonModule,
  SliderModule
];
const components = [
  EndToEndGraphicalComponent];

const routes: Routes = [
  {
    path: 'graphical-tier',
    component: EndToEndGraphicalComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  
})
export class EndToEndGraphicalModule {}
