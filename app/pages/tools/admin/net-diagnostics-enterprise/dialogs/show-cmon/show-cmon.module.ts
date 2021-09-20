import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowCmonComponent } from './show-cmon.component';
import { ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, OrderListModule, PasswordModule, TableModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const components = [ShowCmonComponent];

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

export class ShowCmonModule { }
