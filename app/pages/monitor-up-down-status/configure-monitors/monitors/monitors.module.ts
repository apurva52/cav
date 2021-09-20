import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorsComponent } from './monitors.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, CardModule, PanelModule, ProgressSpinnerModule, SidebarModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import {InputTextModule} from 'primeng/inputtext';

const routes: Routes = [
  {
    path: 'monitors/:techName/:tierName/:monCount/:techDispName/:tierCount/:serverCount/:instanceCount/:status',
    component: MonitorsComponent
  },
  {
    path: 'monitors/:status',
    component: MonitorsComponent
  }
];


@NgModule({
  declarations: [MonitorsComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    CardModule,
    TooltipModule,
    SidebarModule,
    PanelModule,
    BreadcrumbModule,
    ProgressSpinnerModule,
    RouterModule.forChild(routes),
    InputTextModule
  ],
  exports: [
    RouterModule,MonitorsComponent
  ]
})
export class MonitorsModule { }
