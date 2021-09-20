import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNameCrudComponent } from './page-name-crud.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, CardModule, OrderListModule, ToastModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';


const components = [
  PageNameCrudComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  ToastModule
];

const declarations = [PageNameCrudComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})

export class PageNameCrudModule { }
