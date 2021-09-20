import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreDetailsComponent } from './store-details.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, MessageModule, MenuModule, BreadcrumbModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { WidgetMenuModule } from 'src/app/shared/dashboard/widget/widget-menu/widget-menu.module';
import { GeoLocationTimeFilterModule } from 'src/app/shared/geo-location-time-filter/geo-location-time-filter.module';

const routes: Routes = [
  {
    path: 'store',
    component: StoreDetailsComponent,
  },
];

const components = [StoreDetailsComponent];

const imports = [
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  FormsModule,
  CardModule,
  MenuModule,
  MessageModule,
  WidgetMenuModule,
  BreadcrumbModule,
  GeoLocationTimeFilterModule
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})

export class StoreDetailsModule { }
