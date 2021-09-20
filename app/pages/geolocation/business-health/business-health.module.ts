import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessHealthComponent } from './business-health.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, BreadcrumbModule, ToolbarModule, MenuModule, InputTextModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';

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
  BreadcrumbModule,
  HeaderModule,
  ToolbarModule,
  MenuModule,
  InputTextModule
];

const components = [BusinessHealthComponent];


const routes: Routes = [
  {
    path: 'business-health',
    component: BusinessHealthComponent,
  },
];


@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessHealthModule { }
