import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleCrudComponent } from './rule-crud.component';
import { DialogModule, MultiSelectModule, ButtonModule, CheckboxModule, InputTextModule, CardModule, DropdownModule, OrderListModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';


const components = [
  RuleCrudComponent
];

const imports = [
  MultiSelectModule,
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule


];

const declarations = [RuleCrudComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})




export class RuleCrudModule { }
