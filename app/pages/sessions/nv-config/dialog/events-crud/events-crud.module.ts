import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsCrudComponent } from './events-crud.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, CardModule, DropdownModule, OrderListModule, InputTextareaModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';


const components = [
  EventsCrudComponent
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
  InputTextareaModule
];

const declarations = [EventsCrudComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})

export class EventsCrudModule { }
