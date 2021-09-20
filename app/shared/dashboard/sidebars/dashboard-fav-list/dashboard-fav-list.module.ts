import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardFavListComponent } from './dashboard-fav-list.component';
import { SidebarModule, SlideMenuModule, TooltipModule, ButtonModule, MenuModule, InputTextModule, ToastModule, ContextMenuModule } from 'primeng';
import { TreeModule } from 'primeng/tree';
import { DashboardFavListService } from './service/dashboard-fav-list.service';
import { FormsModule } from '@angular/forms';
import { CopyFavoriteLinkBoxModule } from 'src/app/shared/copy-favorite-link-box/copy-favorite-link-box.module';
import { FilterParameterBoxModule } from 'src/app/shared/filter-parameter-box/filter-parameter-box.module';
import { AddDashboardModule } from 'src/app/pages/my-library/dashboards/dialogs/add-dashboard/add-dashboard.module';


@NgModule({
  declarations: [DashboardFavListComponent],
  exports: [DashboardFavListComponent],
  providers: [
    DashboardFavListService
  ],
  imports: [
    CommonModule,
    SidebarModule,
    TreeModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SlideMenuModule,
    MenuModule,
    InputTextModule,
    // InputTextModule,
    ToastModule,
    CopyFavoriteLinkBoxModule,
    FilterParameterBoxModule,
    ContextMenuModule
  ]
})
export class DashboardFavListModule { }
