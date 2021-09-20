import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbQueryStatsFilterComponent } from './db-query-stats-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule, DropdownModule, CheckboxModule, ButtonModule, InputTextModule, AccordionModule, RadioButtonModule, SlideMenuModule, MessageModule, MenuModule, OrderListModule } from 'primeng';
import {TabViewModule} from 'primeng/tabview';
import { DatasourceNavigationModule } from '../../../shared/datasource-navigation/datasource-navigation.module';
import { StatsFilterModule } from '../../../shared/stats-filter/stats-filter.module';

const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  SidebarModule,
  DropdownModule,
  CheckboxModule,
  ButtonModule,
  InputTextModule,
  AccordionModule,
  RadioButtonModule,
  MessageModule,
  MenuModule,
  OrderListModule,
  TabViewModule,
  DatasourceNavigationModule,
  StatsFilterModule,
  SlideMenuModule

];

const declarations = [DbQueryStatsFilterComponent];

@NgModule({
  declarations: [declarations],
  exports: [declarations],
  imports: [imports],
})
export class DbQueryStatsFilterModule { }
