import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbQueriesComponent } from './db-queries.component';
import { Routes, RouterModule } from '@angular/router';
import {
  OrderListModule,
  PanelModule,
  TableModule,
  MenuModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
  InputTextModule,PaginatorModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';

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
  PanelModule,
  MenuModule,
  InputTextModule,
  PaginatorModule,
  PipeModule,
  ChartModule
];

const components = [
  DbQueriesComponent
];

const routes: Routes = [
  {
    path: 'db-queries',
    component: DbQueriesComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  providers:[],
  exports: [
    RouterModule, DbQueriesComponent
  ],
  entryComponents: [DbQueriesComponent]
})
export class DbQueriesModule { }
