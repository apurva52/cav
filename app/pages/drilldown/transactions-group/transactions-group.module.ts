import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsGroupComponent } from './transactions-group.component';
import { RouterModule, Routes } from '@angular/router';
import { MenuModule, OrderListModule, SlideMenuModule, InputTextModule, BreadcrumbModule } from 'primeng';

import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

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
  DropdownModule,
  OrderListModule,
  SlideMenuModule,
  MenuModule,
  InputTextModule,
  BreadcrumbModule,
  PipeModule
];

const components = [TransactionsGroupComponent];

const routes: Routes = [
  {
    path: 'transactions-group',
    component: TransactionsGroupComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsGroupModule { }
