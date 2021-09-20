import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametersComponent } from './parameters.component';
import { FormsModule } from '@angular/forms';
import { SidebarModule, SlideMenuModule, BreadcrumbModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, OrderListModule, CardModule } from 'primeng';


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
  CardModule
];

const declarations = [ParametersComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class ParametersModule { }
