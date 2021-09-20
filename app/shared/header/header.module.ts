import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { Routes, RouterModule } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule, ButtonModule, DropdownModule, SlideMenuModule, ToolbarModule, TooltipModule, ToastModule } from 'primeng';
import { PipeModule } from '../pipes/pipes.module';
import { EventsMenuModule } from './events-menu/events-menu.module';
import { MonitorMenuModule } from './monitor-menu/monitor-menu.module';
import { ThemesMenuModule } from './themes-menu/themes-menu.module';
import { UserMenuModule } from './user-menu/user-menu.module';
import { DataCenterMenuModule } from './data-center-menu/data-center-menu.module';

const imports = [
  CommonModule,

  DataCenterMenuModule,
  EventsMenuModule,
  MonitorMenuModule,
  ThemesMenuModule,
  UserMenuModule,

  OverlayPanelModule,
  MenuModule,
  ButtonModule,
  DropdownModule,
  SlideMenuModule,
  PipeModule,
  ToolbarModule,
  TooltipModule,
  ToastModule
];
const components = [
  HeaderComponent
];
const routes: Routes = [
  {
    path: 'header',
    component: HeaderComponent
  }
];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
    components
  ]
})
export class HeaderModule { }
