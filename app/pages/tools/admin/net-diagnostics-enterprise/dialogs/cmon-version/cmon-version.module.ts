import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmonVersionComponent } from './cmon-version.component';
import { ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, OrderListModule, PasswordModule, TableModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [CmonVersionComponent];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  PasswordModule,
  TableModule,
  CardModule,
  ButtonModule,
  CheckboxModule,
  FormsModule,
  ReactiveFormsModule,
  DialogModule,
  InputTextModule
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class CmonVersionModule { }
