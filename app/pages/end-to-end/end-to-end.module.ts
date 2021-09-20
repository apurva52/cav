import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndToEndComponent } from './end-to-end.component';
import { RouterModule, Routes } from '@angular/router';
import { EndToEndGraphicalComponent } from './end-to-end-graphical/end-to-end-graphical.component';
import { EndToEndGraphicalModule } from './end-to-end-graphical/end-to-end-graphical.module';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CardModule, CarouselModule, CheckboxModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, OverlayPanelModule, PaginatorModule, ToolbarModule, TooltipModule, TreeTableModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { FlowmapsManagementModule } from './flowmaps-management/flowmaps-management.module';
import { FlowmapsManagementComponent } from './flowmaps-management/flowmaps-management.component';
import { EndToEndTierComponent } from './end-to-end-tier/end-to-end-tier.component';
import { EndToEndTierModule } from './end-to-end-tier/end-to-end-tier.module';
import { EndToEndTierLevelComponent } from './end-to-end-tier-level/end-to-end-tier-level.component';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';
import { EndToEndNewGroupModule } from './dialog/end-to-end-new-group/end-to-end-new-group.module';
import { EteTimeFilterModule } from 'src/app/shared/ete-time-filter/ete-time-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: 'end-to-end',

    children: [
      {
        path: '',
        redirectTo: 'graphical-tier',
        pathMatch: 'full',
      },
      {
        path: 'detailed',
        component: EndToEndComponent
      },
      {
        path: 'detailed/:tp',
        component: EndToEndComponent
      },
      {
        path: 'detailed/:tp/:vb',
        component: EndToEndComponent
      },
      {
        path: 'graphical-tier',
        loadChildren: () =>
          import('./end-to-end-graphical/end-to-end-graphical.module').then(
            (m) => m.EndToEndGraphicalModule
          ),
        component: EndToEndGraphicalComponent,
      },
      {
        path: 'graphical-tier/:tp',
        loadChildren: () =>
          import('./end-to-end-graphical/end-to-end-graphical.module').then(
            (m) => m.EndToEndGraphicalModule
          ),
        component: EndToEndGraphicalComponent,
      },
      {
        path: 'graphical-tier/:tp/:vb',
        loadChildren: () =>
          import('./end-to-end-graphical/end-to-end-graphical.module').then(
            (m) => m.EndToEndGraphicalModule
          ),
        component: EndToEndGraphicalComponent,
      },
      {
        path: 'flowmaps',
        loadChildren: () =>
          import('./flowmaps-management/flowmaps-management.module').then(
            (m) => m.FlowmapsManagementModule
          ),
        component: FlowmapsManagementComponent,
      },
      {
        path: 'end-to-end-tier',
        loadChildren: () =>
          import('./end-to-end-tier/end-to-end-tier.module').then(
            (m) => m.EndToEndTierModule
          ),
        component: EndToEndTierComponent,
      },
      
      {
        path: 'end-to-end-tier-level',
        loadChildren: () =>
          import('./end-to-end-tier-level/end-to-end-tier-level.module').then(
            (m) => m.EndToEndTierLevelModule
          ),
        component: EndToEndTierLevelComponent,
      },



    ],
  },
];

const imports = [
  EndToEndGraphicalModule,
  FlowmapsManagementModule,
  ToolbarModule,
  ButtonModule,
  HeaderModule,
  DropdownModule,
  CardModule,
  TreeTableModule,
  MessageModule,
  FormsModule,
  CarouselModule,
  EndToEndTierModule,
  OverlayPanelModule,
  MenuModule,
  CheckboxModule,
  EndToEndNewGroupModule,
  BreadcrumbModule,
  AutoCompleteModule,
  TimeBarModule,
  TooltipModule,
  InputTextModule,
  MultiSelectModule,
  PaginatorModule,
  EteTimeFilterModule,
  PipeModule
];

const components = [EndToEndComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class EndToEndModule { }
