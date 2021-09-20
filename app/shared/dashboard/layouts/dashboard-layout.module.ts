import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { DashboardLayoutGridModule } from './grid/dashboard-layout-grid.module';
import { DashboardLayoutGalleryModule } from './gallery/dashboard-layout-gallery.module';



@NgModule({
  declarations: [DashboardLayoutComponent],
  exports: [
    DashboardLayoutComponent,
    DashboardLayoutGridModule,
    DashboardLayoutGalleryModule
  ],
  imports: [
    CommonModule,
    DashboardLayoutGridModule,
    DashboardLayoutGalleryModule
  ]
})
export class DashboardLayoutModule { }
