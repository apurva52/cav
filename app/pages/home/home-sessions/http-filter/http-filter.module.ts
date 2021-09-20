import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpFilterComponent } from './http-filter.component';
import { ButtonModule, CardModule, CheckboxModule, InputTextModule, DropdownModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToastModule, ToolbarModule, TooltipModule, BreadcrumbModule, PaginatorModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {HttpFilterSidebarModule} from './sidebar/http-filter-sidebar/http-filter-sidebar.module';
import { HttpDetailComponent } from '../http-detail/http-detail.component';
import {TabViewModule} from 'primeng/tabview';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng';



const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  PipeModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  TabViewModule,
  HttpFilterSidebarModule,
  ChartModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  DropdownModule,
  BreadcrumbModule,
  ProgressSpinnerModule,
  PaginatorModule,
  AutoCompleteModule
];

const routes: Routes = [
  {
    path: 'http-filter',
    component: HttpFilterComponent
  },
  {
    path : 'http-detail',
    component : HttpDetailComponent
  }
];



@NgModule({
  declarations: [HttpFilterComponent,HttpDetailComponent],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HttpFilterModule { }
