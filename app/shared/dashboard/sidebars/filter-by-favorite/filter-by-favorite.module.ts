import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterByFavoriteComponent } from './filter-by-favorite.component';
import { FormsModule } from '@angular/forms';
import { SidebarModule, SlideMenuModule, BreadcrumbModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, OrderListModule, CardModule, MultiSelectModule } from 'primeng';

const imports = [
  CommonModule,
  SidebarModule,
  SlideMenuModule,
  BreadcrumbModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  MultiSelectModule
];

const declarations = [FilterByFavoriteComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})


export class FilterByFavoriteModule { }
