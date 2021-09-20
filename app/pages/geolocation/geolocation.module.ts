import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeolocationComponent } from './geolocation.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolbarModule, ButtonModule, DropdownModule, TableModule, CardModule, CheckboxModule, MessageModule, CarouselModule, BreadcrumbModule, TooltipModule, OverlayPanelModule, MultiSelectModule, InputTextModule, MenuModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { StoreDetailsModule } from './store-details/store-details.module';
import { ConfigureSidebarModule } from '../../shared/search-sidebar/configure-sidebar/configure-sidebar.module';
import { BusinessHealthComponent } from './business-health/business-health.component';
import { SearchSidebarModule } from 'src/app/shared/search-sidebar/search-sidebar/search-sidebar.module';
import { MapModule } from 'src/app/shared/map/map.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { GeoLocationTimeFilterModule } from 'src/app/shared/geo-location-time-filter/geo-location-time-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { TopTransactionModule } from './sidebars/top-transaction/top-transaction.module';
const routes: Routes = [
  {
    path: 'geo-location',
    
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
      {
        path: 'details',
        component: GeolocationComponent,
      },
      {
        path: 'details/:tp',
        component: GeolocationComponent,
      },
      {
        path: 'details/:tp/:st/:et',
        component: GeolocationComponent,
      },
      {
        path: 'store/:store',
        loadChildren: () =>
          import('./store-details/store-details.module').then(
            (m) => m.StoreDetailsModule
          ),
        component: StoreDetailsComponent,
      },
      {
        path: 'business-health',
        loadChildren: () =>
          import('./business-health/business-health.module').then(
            (m) => m.BusinessHealthModule
          ),
        component: BusinessHealthComponent,
      }
    ],
  },
];

const components = [GeolocationComponent];

const imports = [
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  DropdownModule,
  FormsModule,
  TableModule,
  CardModule,
  CheckboxModule,
  MessageModule,
  StoreDetailsModule,
  CarouselModule,
  ConfigureSidebarModule,
  SearchSidebarModule,
  BreadcrumbModule,
  MapModule,
  TooltipModule,
  ChartModule,
  OverlayPanelModule,
  GeoLocationTimeFilterModule,
  PipeModule,
  MultiSelectModule,
  InputTextModule,
  MenuModule,
  TopTransactionModule
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class GeolocationModule { }
