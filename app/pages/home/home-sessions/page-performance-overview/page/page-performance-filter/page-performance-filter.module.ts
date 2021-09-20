import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagePerformanceFilterComponent } from './page-performance-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { ButtonModule, CardModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, SelectButtonModule, SidebarModule, TabViewModule, TooltipModule, MultiSelectModule, ToastModule} from 'primeng';
import { FormsModule ,ReactiveFormsModule  } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';


const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule,ReactiveFormsModule,
  InputTextModule,
  DropdownModule,
  SidebarModule,
  DropdownModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  TabViewModule,
  SelectButtonModule,
  MultiSelectModule,
  ToastModule
];

const components = [PagePerformanceFilterComponent];

const routes: Routes = [
  {
    path: 'page-performance-filter',
    component: PagePerformanceFilterComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class PagePerformanceFilterModule { }
